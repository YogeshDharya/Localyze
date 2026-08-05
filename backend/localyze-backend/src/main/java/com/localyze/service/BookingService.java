package com.localyze.service;

import com.localyze.dto.request.BookingRequest;
import com.localyze.dto.response.BookingResponse;
import com.localyze.dto.response.PagedResponse;
import com.localyze.entity.*;
import com.localyze.entity.enums.BookingStatus;
import com.localyze.exception.BadRequestException;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.exception.UnauthorizedException;
import com.localyze.mapper.BookingMapper;
import com.localyze.repository.BookingRepository;
import com.localyze.repository.ServiceRepository;
import com.localyze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Manages booking lifecycle: creation, status transitions,
 * cancellation, and retrieval for both users and sellers.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;

    /**
     * Creates a new booking for the authenticated user.
     *
     * @param userEmail the booking user's email
     * @param request   the booking request
     * @return the created booking response
     * @throws BadRequestException       if the service is deleted/unavailable
     * @throws ResourceNotFoundException if the user or service does not exist
     */
    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        ServiceEntity service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", request.getServiceId()));

        if (service.isDeleted()) {
            throw new BadRequestException("This service is no longer available");
        }

        Booking booking = Booking.builder()
                .user(user)
                .service(service)
                .seller(service.getSeller())
                .status(BookingStatus.PENDING)
                .bookingDate(request.getBookingDate())
                .timeSlot(request.getTimeSlot())
                .notes(request.getNotes())
                .build();

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * Retrieves paginated bookings for the authenticated user,
     * optionally filtered by status.
     *
     * @param userEmail the user's email
     * @param status    optional booking status filter
     * @param page      page number (0-based)
     * @param size      page size
     * @return paginated booking responses
     */
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getUserBookings(String userEmail, String status, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookingPage;

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            bookingPage = bookingRepository.findByUserIdAndStatus(
                    user.getId(), BookingStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            bookingPage = bookingRepository.findByUserId(user.getId(), pageable);
        }

        return buildPagedResponse(bookingPage);
    }

    /**
     * Retrieves paginated bookings for the authenticated seller.
     *
     * @param sellerEmail the seller's email
     * @param status      optional booking status filter (reserved for future use)
     * @param page        page number (0-based)
     * @param size        page size
     * @return paginated booking responses
     */
    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getSellerBookings(String sellerEmail, String status, int page, int size) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", sellerEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Booking> bookingPage;

        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            bookingPage = bookingRepository.findBySellerIdAndStatus(seller.getId(), BookingStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            bookingPage = bookingRepository.findBySellerId(seller.getId(), pageable);
        }

        return buildPagedResponse(bookingPage);
    }

    /**
     * Retrieves a single booking by ID. Only the booking user or seller can view it.
     *
     * @param id        the booking ID
     * @param userEmail the authenticated user's email
     * @return the booking response
     * @throws UnauthorizedException     if the user has no access to this booking
     * @throws ResourceNotFoundException if the booking does not exist
     */
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // Only the booking user or the seller can view the booking
        if (!booking.getUser().getEmail().equals(userEmail)
                && !booking.getSeller().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You don't have access to this booking");
        }

        return bookingMapper.toResponse(booking);
    }

    /**
     * Updates a booking's status. Only the seller can advance the status
     * through the valid transition chain: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED.
     *
     * @param id        the booking ID
     * @param status    the new status
     * @param userEmail the authenticated user's email (must be the seller)
     * @return the updated booking response
     * @throws BadRequestException   if the status transition is invalid
     * @throws UnauthorizedException if the user is not the seller
     */
    @Transactional
    public BookingResponse updateBookingStatus(Long id, String status, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // Validate the user has permission
        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());

        // Sellers can confirm, mark in-progress, or complete
        if (booking.getSeller().getEmail().equals(userEmail)) {
            if (newStatus == BookingStatus.CONFIRMED && booking.getStatus() == BookingStatus.PENDING) {
                booking.setStatus(BookingStatus.CONFIRMED);
            } else if (newStatus == BookingStatus.IN_PROGRESS && booking.getStatus() == BookingStatus.CONFIRMED) {
                booking.setStatus(BookingStatus.IN_PROGRESS);
            } else if (newStatus == BookingStatus.COMPLETED && booking.getStatus() == BookingStatus.IN_PROGRESS) {
                booking.setStatus(BookingStatus.COMPLETED);
            } else {
                throw new BadRequestException("Invalid status transition");
            }
        } else {
            throw new UnauthorizedException("Only the seller can update booking status");
        }

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * Cancels a booking. Both the booking user and the seller can cancel,
     * unless the booking is already completed or cancelled.
     *
     * @param id        the booking ID
     * @param reason    the cancellation reason
     * @param userEmail the authenticated user's email
     * @return the cancelled booking response
     * @throws BadRequestException   if the booking is completed or already cancelled
     * @throws UnauthorizedException if the user has no access to this booking
     */
    @Transactional
    public BookingResponse cancelBooking(Long id, String reason, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", id));

        // Both user and seller can cancel
        if (!booking.getUser().getEmail().equals(userEmail)
                && !booking.getSeller().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You don't have access to this booking");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * Builds a PagedResponse from a Page of Bookings.
     */
    private PagedResponse<BookingResponse> buildPagedResponse(Page<Booking> bookingPage) {
        List<BookingResponse> content = bookingPage.getContent().stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<BookingResponse>builder()
                .content(content)
                .page(bookingPage.getNumber())
                .size(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .last(bookingPage.isLast())
                .build();
    }
}
