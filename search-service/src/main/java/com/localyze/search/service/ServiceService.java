package com.localyze.search.service;

import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.ServiceResponse;
import com.localyze.common.enums.Role;
import com.localyze.common.enums.ServiceStatus;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.common.util.GeoUtils;
import com.localyze.search.dto.CreateServiceRequest;
import com.localyze.search.dto.RatingUpdateRequest;
import com.localyze.search.dto.UpdateServiceRequest;
import com.localyze.search.entity.Category;
import com.localyze.search.entity.ServiceEntity;
import com.localyze.search.entity.ServiceImage;
import com.localyze.search.repository.CategoryRepository;
import com.localyze.search.repository.ServiceImageRepository;
import com.localyze.search.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceImageRepository serviceImageRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public ServiceResponse createService(CreateServiceRequest request, Long providerId, String providerName) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        ServiceEntity serviceEntity = ServiceEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .priceUnit(request.getPriceUnit())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .city(request.getCity())
                .address(request.getAddress())
                .providerId(providerId)
                .providerName(providerName)
                .categoryId(category.getId())
                .status(ServiceStatus.ACTIVE)
                .build();

        return mapToResponse(serviceRepository.save(serviceEntity), category.getName());
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return mapToResponse(service, getCategoryName(service.getCategoryId()));
    }

    @Transactional
    public ServiceResponse updateService(Long id, UpdateServiceRequest request, Long requesterId) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!service.getProviderId().equals(requesterId)) {
            throw new UnauthorizedException("You do not have permission to update this service");
        }

        if (request.getTitle() != null) service.setTitle(request.getTitle());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getPriceUnit() != null) service.setPriceUnit(request.getPriceUnit());
        if (request.getLatitude() != null) service.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) service.setLongitude(request.getLongitude());
        if (request.getCity() != null) service.setCity(request.getCity());
        if (request.getAddress() != null) service.setAddress(request.getAddress());
        
        if (request.getCategoryId() != null) {
            if (!categoryRepository.existsById(request.getCategoryId())) {
                throw new ResourceNotFoundException("Category not found");
            }
            service.setCategoryId(request.getCategoryId());
        }

        return mapToResponse(serviceRepository.save(service), getCategoryName(service.getCategoryId()));
    }

    @Transactional
    public void deleteService(Long id, Long requesterId, String requesterRole) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!service.getProviderId().equals(requesterId) && !Role.ADMIN.name().equals(requesterRole)) {
            throw new UnauthorizedException("You do not have permission to delete this service");
        }

        List<ServiceImage> images = serviceImageRepository.findByServiceId(id);
        for (ServiceImage image : images) {
            if (image.getPublicId() != null) {
                cloudinaryService.deleteImage(image.getPublicId());
            }
        }
        
        serviceRepository.delete(service);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> getAllServices(int page, int size) {
        Page<ServiceEntity> servicePage = serviceRepository.findAll(PageRequest.of(page, size));
        return createPagedResponse(servicePage);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> getServicesByProvider(Long providerId, int page, int size) {
        Page<ServiceEntity> servicePage = serviceRepository.findByProviderId(providerId, PageRequest.of(page, size));
        return createPagedResponse(servicePage);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> getServicesByCategory(Long categoryId, int page, int size) {
        Page<ServiceEntity> servicePage = serviceRepository.findByCategoryIdAndStatus(categoryId, ServiceStatus.ACTIVE, PageRequest.of(page, size));
        return createPagedResponse(servicePage);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> searchServices(String query, int page, int size) {
        Page<ServiceEntity> servicePage = serviceRepository.searchByTextAndStatus(query, ServiceStatus.ACTIVE, PageRequest.of(page, size));
        return createPagedResponse(servicePage);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getNearbyServices(Double lat, Double lng, Double radiusKm, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ServiceEntity> servicesPage;
        
        if (categoryId != null) {
            servicesPage = serviceRepository.findByCategoryIdAndStatus(categoryId, ServiceStatus.ACTIVE, pageable);
        } else {
            servicesPage = serviceRepository.findByStatus(ServiceStatus.ACTIVE, pageable);
        }

        return servicesPage.stream()
                .filter(s -> GeoUtils.withinRadius(lat, lng, s.getLatitude(), s.getLongitude(), radiusKm))
                .map(s -> {
                    ServiceResponse resp = mapToResponse(s, getCategoryName(s.getCategoryId()));
                    resp.setDistanceKm(GeoUtils.distanceKm(lat, lng, s.getLatitude(), s.getLongitude()));
                    return resp;
                })
                .sorted(Comparator.comparing(ServiceResponse::getDistanceKm))
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceResponse updateRating(Long serviceId, RatingUpdateRequest request) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        service.setAverageRating(request.getNewAverageRating());
        service.setTotalReviews(request.getNewTotalReviews());
        
        return mapToResponse(serviceRepository.save(service), getCategoryName(service.getCategoryId()));
    }

    @Transactional
    public ServiceResponse addServiceImage(Long serviceId, String imageUrl, String publicId, boolean isPrimary) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (isPrimary) {
            List<ServiceImage> existingImages = serviceImageRepository.findByServiceId(serviceId);
            for (ServiceImage img : existingImages) {
                if (img.isPrimary()) {
                    img.setPrimary(false);
                    serviceImageRepository.save(img);
                }
            }
        }

        ServiceImage image = ServiceImage.builder()
                .serviceId(serviceId)
                .imageUrl(imageUrl)
                .publicId(publicId)
                .primary(isPrimary)
                .build();
        serviceImageRepository.save(image);

        return mapToResponse(service, getCategoryName(service.getCategoryId()));
    }

    @Transactional
    public void deleteServiceImage(Long imageId, Long serviceId) {
        ServiceImage image = serviceImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found"));

        if (!image.getServiceId().equals(serviceId)) {
            throw new UnauthorizedException("Image does not belong to this service");
        }

        if (image.getPublicId() != null) {
            cloudinaryService.deleteImage(image.getPublicId());
        }

        serviceImageRepository.delete(image);
    }

    private String getCategoryName(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId).map(Category::getName).orElse(null);
    }

    private ServiceResponse mapToResponse(ServiceEntity service, String categoryName) {
        List<ServiceImage> images = serviceImageRepository.findByServiceId(service.getId());
        List<String> imageUrls = images.stream().map(ServiceImage::getImageUrl).collect(Collectors.toList());

        return ServiceResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .description(service.getDescription())
                .price(service.getPrice())
                .priceUnit(service.getPriceUnit())
                .latitude(service.getLatitude())
                .longitude(service.getLongitude())
                .city(service.getCity())
                .address(service.getAddress())
                .averageRating(service.getAverageRating())
                .totalReviews(service.getTotalReviews())
                .status(service.getStatus().name())
                .providerId(service.getProviderId())
                .providerName(service.getProviderName())
                .categoryId(service.getCategoryId())
                .categoryName(categoryName)
                .imageUrls(imageUrls)
                .build();
    }

    private PagedResponse<ServiceResponse> createPagedResponse(Page<ServiceEntity> page) {
        List<ServiceResponse> content = page.getContent().stream()
                .map(s -> mapToResponse(s, getCategoryName(s.getCategoryId())))
                .collect(Collectors.toList());

        return PagedResponse.<ServiceResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
