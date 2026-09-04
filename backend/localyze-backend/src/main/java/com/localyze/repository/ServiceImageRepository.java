package com.localyze.repository;

import com.localyze.entity.ServiceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceImageRepository extends JpaRepository<ServiceImage, Long> {

    List<ServiceImage> findByServiceId(Long serviceId);

    void deleteByServiceId(Long serviceId);
}
