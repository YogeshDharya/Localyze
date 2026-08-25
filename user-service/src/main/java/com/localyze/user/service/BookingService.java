package com.localyze.user.service;

import com.localyze.common.dto.request.BookingRequest;
import com.localyze.common.dto.response.ApiResponse;
import com.localyze.common.dto.response.BookingResponse;
import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.ServiceResponse;
import com.localyze.common.enums.BookingStatus;
import com.localyze.common.enums.Role;
import com.localyze.common.event.BookingEvent;
import com.localyze.common.exception.BadRequestException;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.user.client.SearchServiceClient;
import com.localyze.user.entity.Booking;
import com.localyze.user.kafka.BookingEventProducer;
import com.localyze.user.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepository;
    private final SearchServiceClient searchServiceClient;
    private final BookingEventProducer bookingEventProducer;

    @Transactional
    public BookingResponse createBooking(Long customerId, String customerName, BookingRequest request) {
        ApiResponse<Boolean> existsResponse = searchServiceClient.checkServiceExists(request.getServiceId());
        if (existsResponse == null || !Boolean.TRUE.equals(existsResponse.getData())) {
            throw new BadRequestException("Service not found");
        }
        
        ApiResponse<ServiceResponse> serviceResponse = searchServiceClient.getService(request.getServiceId());
        if (serviceResponse == null || serviceResponse.getData() == null) {
            throw new BadRequestException("Could not fetch service details");
        }
        
        ServiceResponse serviceDetails = serviceResponse.getData();
        
        Booking booking = Booking.builder()
                .serviceId(request.getServiceId())
                .serviceTitle(serviceDetails.getTitle())
                .customerId(customerId)
                .customerName(customerName)
                .providerId(serviceDetails.getProviderId())
                .scheduledAt(request.getScheduledAt())
                .notes(request.getNotes())
                .totalAmount(serviceDetails.getPrice())
                .status(BookingStatus.PENDING)
                .build();
                
        bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    public BookingResponse getBookingById(Long id, Long requesterId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (!booking.getCustomerId().equals(requesterId) && !booking.getProviderId().equals(requesterId)) {
            throw new UnauthorizedException("Not authorized to view this booking");
        }
        
        return mapToResponse(booking);
    }

    public PagedResponse<BookingResponse> getMyBookingsAsCustomer(Long customerId, int page, int size) {
        Page<Booking> bookingPage = bookingRepository.findByCustomerId(customerId, PageRequest.of(page, size));
        return buildPagedResponse(bookingPage);
    }

    public PagedResponse<BookingResponse> getMyBookingsAsProvider(Long providerId, int page, int size) {
        Page<Booking> bookingPage = bookingRepository.findByProviderId(providerId, PageRequest.of(page, size));
        return buildPagedResponse(bookingPage);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus, Long requesterId, String requesterRole) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (!booking.getProviderId().equals(requesterId) && !Role.ADMIN.name().equals(requesterRole) && !booking.getCustomerId().equals(requesterId)) {
            throw new UnauthorizedException("Not authorized to update this booking");
        }

        booking.setStatus(newStatus);
        bookingRepository.save(booking);

        if (newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.CANCELLED) {
            BookingEvent event = BookingEvent.builder()
                    .bookingId(booking.getId())
                    .customerId(booking.getCustomerId())
                    .providerId(booking.getProviderId())
                    .eventType(newStatus.name())
                    .build();
            bookingEventProducer.publishBookingEvent(event);
        }

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long requesterId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
                
        if (!booking.getCustomerId().equals(requesterId) && !booking.getProviderId().equals(requesterId)) {
            throw new UnauthorizedException("Not authorized to cancel this booking");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        BookingEvent event = BookingEvent.builder()
                .bookingId(booking.getId())
                .customerId(booking.getCustomerId())
                .providerId(booking.getProviderId())
                .eventType("CANCELLED")
                .build();
        bookingEventProducer.publishBookingEvent(event);
        
        return mapToResponse(booking);
    }
    
    private PagedResponse<BookingResponse> buildPagedResponse(Page<Booking> page) {
        List<BookingResponse> content = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .serviceId(booking.getServiceId())
                .customerId(booking.getCustomerId())
                .providerId(booking.getProviderId())
                .scheduledAt(booking.getScheduledAt())
                .status(booking.getStatus() != null ? booking.getStatus().name() : null)
                .notes(booking.getNotes())
                .totalAmount(booking.getTotalAmount())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
