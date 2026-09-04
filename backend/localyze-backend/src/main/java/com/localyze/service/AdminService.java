package com.localyze.service;

import com.localyze.dto.response.PagedResponse;
import com.localyze.dto.response.ServiceResponse;
import com.localyze.dto.response.UserResponse;
import com.localyze.entity.ServiceEntity;
import com.localyze.entity.User;
import com.localyze.entity.enums.Role;
import com.localyze.entity.enums.ServiceStatus;
import com.localyze.exception.ResourceNotFoundException;
import com.localyze.mapper.ServiceMapper;
import com.localyze.mapper.UserMapper;
import com.localyze.repository.BookingRepository;
import com.localyze.repository.CategoryRepository;
import com.localyze.repository.ServiceRepository;
import com.localyze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final CategoryRepository categoryRepository;
    private final UserMapper userMapper;
    private final ServiceMapper serviceMapper;

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(String roleStr, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> usersPage;
        
        if (roleStr != null && !roleStr.trim().isEmpty()) {
            try {
                Role role = Role.valueOf(roleStr.trim().toUpperCase());
                usersPage = userRepository.findByRole(role, pageRequest);
            } catch (IllegalArgumentException e) {
                usersPage = userRepository.findAll(pageRequest);
            }
        } else {
            usersPage = userRepository.findAll(pageRequest);
        }

        return PagedResponse.<UserResponse>builder()
                .content(usersPage.getContent().stream().map(userMapper::toResponse).toList())
                .page(usersPage.getNumber())
                .size(usersPage.getSize())
                .totalElements(usersPage.getTotalElements())
                .totalPages(usersPage.getTotalPages())
                .last(usersPage.isLast())
                .build();
    }

    @Transactional
    public void updateUserStatus(Long id, Boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (isActive != null) {
            user.setActive(isActive);
            userRepository.save(user);
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ServiceResponse> getAllServices(String statusStr, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ServiceEntity> servicesPage;

        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                ServiceStatus status = ServiceStatus.valueOf(statusStr.trim().toUpperCase());
                servicesPage = serviceRepository.findByStatusAndIsDeletedFalse(status, pageRequest);
            } catch (IllegalArgumentException e) {
                servicesPage = serviceRepository.findAll(pageRequest);
            }
        } else {
            servicesPage = serviceRepository.findAll(pageRequest);
        }

        return PagedResponse.<ServiceResponse>builder()
                .content(servicesPage.getContent().stream().map(serviceMapper::toResponse).toList())
                .page(servicesPage.getNumber())
                .size(servicesPage.getSize())
                .totalElements(servicesPage.getTotalElements())
                .totalPages(servicesPage.getTotalPages())
                .last(servicesPage.isLast())
                .build();
    }

    @Transactional
    public void updateServiceStatus(Long id, String statusStr) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        if (statusStr != null && !statusStr.trim().isEmpty()) {
            try {
                ServiceStatus status = ServiceStatus.valueOf(statusStr.trim().toUpperCase());
                service.setStatus(status);
                serviceRepository.save(service);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + statusStr);
            }
        }
    }

    @Transactional
    public void deleteService(Long id) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        service.setDeleted(true);
        serviceRepository.save(service);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalSellers", userRepository.countByRole(Role.SELLER));
        stats.put("totalServices", serviceRepository.count());
        stats.put("activeServices", serviceRepository.countByStatus(ServiceStatus.ACTIVE));
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        return stats;
    }
}
