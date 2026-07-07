package com.localyze.service;

import com.localyze.dto.request.ServiceRequest;
import com.localyze.dto.response.PagedResponse;
import com.localyze.dto.response.ServiceResponse;
import com.localyze.entity.*;
import com.localyze.entity.enums.Role;
import com.localyze.entity.enums.ServiceStatus;
import com.localyze.exception.BadRequestException;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.exception.UnauthorizedException;
import com.localyze.mapper.ServiceMapper;
import com.localyze.repository.CategoryRepository;
import com.localyze.repository.ServiceImageRepository;
import com.localyze.repository.ServiceRepository;
import com.localyze.repository.UserRepository;
import com.localyze.util.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Handles service listing CRUD operations, nearby search using the
 * Haversine formula, and advanced filtering/sorting/pagination.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceImageRepository serviceImageRepository;
    private final ServiceMapper serviceMapper;

    /**
     * Retrieves a paginated list of active services with optional filters.
     *
     * @param categoryId optional category filter
     * @param search     optional text search (title/description)
     * @param minPrice   optional minimum price filter
     * @param maxPrice   optional maximum price filter
     * @param minRating  optional minimum rating filter
     * @param sortBy     field to sort by (default: createdAt)
     * @param sortDir    sort direction (asc/desc)
     * @param page       page number (0-based)
     * @param size       page size
     * @return paginated service responses
     */
    public PagedResponse<ServiceResponse> getAllServices(
            Long categoryId, String search, Double minPrice, Double maxPrice,
            Double minRating, String sortBy, String sortDir, int page, int size) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ServiceEntity> servicePage;
        if (categoryId != null) {
            servicePage = serviceRepository.findByCategoryIdAndStatusAndIsDeletedFalse(
                    categoryId, ServiceStatus.ACTIVE, pageable);
        } else {
            servicePage = serviceRepository.findByStatusAndIsDeletedFalse(ServiceStatus.ACTIVE, pageable);
        }

        List<ServiceResponse> content = servicePage.getContent().stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());

        // Apply text search filter in-memory if provided
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            content = content.stream()
                    .filter(s -> s.getTitle().toLowerCase().contains(searchLower)
                            || s.getDescription().toLowerCase().contains(searchLower))
                    .collect(Collectors.toList());
        }

        // Apply price and rating filters
        if (minPrice != null) {
            content = content.stream().filter(s -> s.getPrice().doubleValue() >= minPrice).collect(Collectors.toList());
        }
        if (maxPrice != null) {
            content = content.stream().filter(s -> s.getPrice().doubleValue() <= maxPrice).collect(Collectors.toList());
        }
        if (minRating != null) {
            content = content.stream().filter(s -> s.getAvgRating() >= minRating).collect(Collectors.toList());
        }

        return PagedResponse.<ServiceResponse>builder()
                .content(content)
                .page(servicePage.getNumber())
                .size(servicePage.getSize())
                .totalElements(servicePage.getTotalElements())
                .totalPages(servicePage.getTotalPages())
                .last(servicePage.isLast())
                .build();
    }

    /**
     * Finds active services within a given radius using the Haversine formula.
     *
     * @param lat        search center latitude
     * @param lng        search center longitude
     * @param radius     search radius in kilometers
     * @param categoryId optional category filter
     * @param minPrice   optional minimum price filter
     * @param maxPrice   optional maximum price filter
     * @param minRating  optional minimum rating filter
     * @param sortBy     sort field (price, rating, or distance)
     * @return list of nearby service responses sorted by the specified field
     */
    public List<ServiceResponse> getNearbyServices(
            double lat, double lng, double radius,
            Long categoryId, Double minPrice, Double maxPrice, Double minRating,
            String sortBy) {

        // Get all active services and filter by distance
        List<ServiceEntity> allActive = serviceRepository
                .findByStatusAndIsDeletedFalse(ServiceStatus.ACTIVE, Pageable.unpaged())
                .getContent();

        List<ServiceResponse> nearby = new ArrayList<>();
        for (ServiceEntity service : allActive) {
            double distance = GeoUtils.calculateDistance(lat, lng, service.getLatitude(), service.getLongitude());
            if (distance <= radius) {
                ServiceResponse response = serviceMapper.toResponse(service, distance);
                nearby.add(response);
            }
        }

        // Apply filters
        if (categoryId != null) {
            nearby = nearby.stream().filter(s -> s.getCategoryId().equals(categoryId)).collect(Collectors.toList());
        }
        if (minPrice != null) {
            nearby = nearby.stream().filter(s -> s.getPrice().doubleValue() >= minPrice).collect(Collectors.toList());
        }
        if (maxPrice != null) {
            nearby = nearby.stream().filter(s -> s.getPrice().doubleValue() <= maxPrice).collect(Collectors.toList());
        }
        if (minRating != null) {
            nearby = nearby.stream().filter(s -> s.getAvgRating() >= minRating).collect(Collectors.toList());
        }

        // Sort
        if ("price".equalsIgnoreCase(sortBy)) {
            nearby.sort(Comparator.comparing(ServiceResponse::getPrice));
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            nearby.sort(Comparator.comparing(ServiceResponse::getAvgRating).reversed());
        } else {
            // Default: sort by distance
            nearby.sort(Comparator.comparing(ServiceResponse::getDistance));
        }

        return nearby;
    }

    /**
     * Retrieves a single service by ID.
     *
     * @param id the service ID
     * @return the service response
     * @throws ResourceNotFoundException if the service does not exist or is deleted
     */
    public ServiceResponse getServiceById(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        if (service.isDeleted()) {
            throw new ResourceNotFoundException("Service", "id", id);
        }
        return serviceMapper.toResponse(service);
    }

    /**
     * Creates a new service listing for the authenticated seller.
     *
     * @param sellerEmail the seller's email
     * @param request     the service creation request
     * @return the created service response
     * @throws UnauthorizedException     if the user is not a seller or admin
     * @throws ResourceNotFoundException if the category does not exist
     * @throws BadRequestException       if more than 5 images are provided
     */
    @Transactional
    public ServiceResponse createService(String sellerEmail, ServiceRequest request) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", sellerEmail));

        if (seller.getRole() != Role.SELLER && seller.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only sellers can create services");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        ServiceEntity service = ServiceEntity.builder()
                .seller(seller)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .priceUnit(request.getPriceUnit() != null ? request.getPriceUnit() : "fixed")
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .availability(request.getAvailability())
                .status(ServiceStatus.ACTIVE)
                .avgRating(0.0)
                .totalReviews(0)
                .isDeleted(false)
                .build();

        service = serviceRepository.save(service);

        // Save images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            if (request.getImageUrls().size() > 5) {
                throw new BadRequestException("Maximum 5 images allowed per service");
            }
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ServiceImage image = ServiceImage.builder()
                        .service(service)
                        .imageUrl(request.getImageUrls().get(i))
                        .displayOrder(i)
                        .build();
                serviceImageRepository.save(image);
            }
        }

        return serviceMapper.toResponse(service);
    }

    /**
     * Updates an existing service listing. Only non-null fields are updated.
     * Images are replaced entirely if provided.
     *
     * @param id          the service ID
     * @param sellerEmail the authenticated seller's email
     * @param request     the service update request
     * @return the updated service response
     * @throws UnauthorizedException     if the user does not own the service
     * @throws ResourceNotFoundException if the service or category does not exist
     * @throws BadRequestException       if more than 5 images are provided
     */
    @Transactional
    public ServiceResponse updateService(Long id, String sellerEmail, ServiceRequest request) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

        if (!service.getSeller().getEmail().equals(sellerEmail)) {
            throw new UnauthorizedException("You can only edit your own services");
        }

        if (request.getTitle() != null) service.setTitle(request.getTitle());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            service.setCategory(category);
        }
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getPriceUnit() != null) service.setPriceUnit(request.getPriceUnit());
        if (request.getAddress() != null) service.setAddress(request.getAddress());
        if (request.getLatitude() != null) service.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) service.setLongitude(request.getLongitude());
        if (request.getAvailability() != null) service.setAvailability(request.getAvailability());

        // Update images if provided
        if (request.getImageUrls() != null) {
            if (request.getImageUrls().size() > 5) {
                throw new BadRequestException("Maximum 5 images allowed per service");
            }
            serviceImageRepository.deleteByServiceId(id);
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                ServiceImage image = ServiceImage.builder()
                        .service(service)
                        .imageUrl(request.getImageUrls().get(i))
                        .displayOrder(i)
                        .build();
                serviceImageRepository.save(image);
            }
        }

        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    /**
     * Soft-deletes a service by marking it as deleted and inactive.
     *
     * @param id          the service ID
     * @param sellerEmail the authenticated seller's email
     * @throws UnauthorizedException     if the user does not own the service
     * @throws ResourceNotFoundException if the service does not exist
     */
    @Transactional
    public void deleteService(Long id, String sellerEmail) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

        if (!service.getSeller().getEmail().equals(sellerEmail)) {
            throw new UnauthorizedException("You can only delete your own services");
        }

        service.setDeleted(true);
        service.setStatus(ServiceStatus.INACTIVE);
        serviceRepository.save(service);
    }

    /**
     * Retrieves a paginated list of the authenticated seller's own services.
     *
     * @param sellerEmail the seller's email
     * @param page        page number (0-based)
     * @param size        page size
     * @return paginated service responses
     */
    public PagedResponse<ServiceResponse> getMyServices(String sellerEmail, int page, int size) {
    		System.out.println(sellerEmail);
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", sellerEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ServiceEntity> servicePage = serviceRepository.findBySellerIdAndIsDeletedFalse(seller.getId(), pageable);

        List<ServiceResponse> content = servicePage.getContent().stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ServiceResponse>builder()
                .content(content)
                .page(servicePage.getNumber())
                .size(servicePage.getSize())
                .totalElements(servicePage.getTotalElements())
                .totalPages(servicePage.getTotalPages())
                .last(servicePage.isLast())
                .build();
    }

    /**
     * Retrieves a paginated list of services for a given seller (public view).
     *
     * @param sellerId the seller's user ID
     * @param page     page number (0-based)
     * @param size     page size
     * @return paginated service responses
     */
    public PagedResponse<ServiceResponse> getSellerServices(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ServiceEntity> servicePage = serviceRepository.findBySellerIdAndIsDeletedFalse(sellerId, pageable);

        List<ServiceResponse> content = servicePage.getContent().stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ServiceResponse>builder()
                .content(content)
                .page(servicePage.getNumber())
                .size(servicePage.getSize())
                .totalElements(servicePage.getTotalElements())
                .totalPages(servicePage.getTotalPages())
                .last(servicePage.isLast())
                .build();
    }
}
