package com.localyze.user.service;

import com.localyze.common.dto.response.PagedResponse;
import com.localyze.common.dto.response.UserResponse;
import com.localyze.common.enums.Role;
import com.localyze.common.exception.ResourceNotFoundException;
import com.localyze.common.exception.UnauthorizedException;
import com.localyze.user.dto.CreateUserProfileRequest;
import com.localyze.user.dto.UpdateProfileRequest;
import com.localyze.user.entity.UserProfile;
import com.localyze.user.repository.UserProfileRepository;
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
public class UserService {
    private final UserProfileRepository userProfileRepository;

    public UserResponse getUserById(Long id) {
        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for id: " + id));
        return mapToResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        UserProfile user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found for email: " + email));
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUserProfile(Long id, UpdateProfileRequest request, Long requesterId) {
        if (!id.equals(requesterId)) {
            throw new UnauthorizedException("You can only update your own profile");
        }
        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        userProfileRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse uploadAvatar(Long id, String avatarUrl) {
        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        user.setAvatarUrl(avatarUrl);
        userProfileRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public void deactivateUser(Long id, Long requesterId, String requesterRole) {
        if (!id.equals(requesterId) && !Role.ADMIN.name().equals(requesterRole)) {
            throw new UnauthorizedException("You do not have permission to deactivate this user");
        }
        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
        user.setActive(false);
        userProfileRepository.save(user);
    }

    public PagedResponse<UserResponse> getAllUsers(int page, int size) {
        Page<UserProfile> userPage = userProfileRepository.findAll(PageRequest.of(page, size));
        List<UserResponse> responses = userPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new PagedResponse<>(
                responses,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Transactional
    public UserResponse createUserProfile(CreateUserProfileRequest request) {
        if (userProfileRepository.existsById(request.getId()) || userProfileRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User profile already exists");
        }
        UserProfile user = UserProfile.builder()
                .id(request.getId())
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .city(request.getCity())
                .role(request.getRole())
                .build();
        userProfileRepository.save(user);
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(UserProfile user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .active(user.isActive())
                .build();
    }
}
