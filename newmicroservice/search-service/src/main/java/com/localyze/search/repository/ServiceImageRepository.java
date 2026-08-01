package com.localyze.search.repository;

import com.localyze.search.entity.ServiceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceImageRepository extends JpaRepository<ServiceImage, Long> {
    List<ServiceImage> findByServiceId(Long serviceId);
}
