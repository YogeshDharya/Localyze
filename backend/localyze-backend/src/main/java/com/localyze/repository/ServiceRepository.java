package com.localyze.repository;

import com.localyze.entity.ServiceEntity;
import com.localyze.entity.enums.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    Page<ServiceEntity> findByCategoryIdAndStatusAndIsDeletedFalse(
            Long categoryId, ServiceStatus status, Pageable pageable);

    Page<ServiceEntity> findBySellerIdAndIsDeletedFalse(Long sellerId, Pageable pageable);

    Page<ServiceEntity> findByStatusAndIsDeletedFalse(ServiceStatus status, Pageable pageable);

    /**
     * Find nearby services using the Haversine formula.
     *
     * @param lat    latitude of the search center
     * @param lng    longitude of the search center
     * @param radius search radius in kilometers
     * @return list of Object arrays containing service columns and calculated distance
     */
    @Query(value = "SELECT s.*, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(s.latitude)) * " +
            "cos(radians(s.longitude) - radians(:lng)) + " +
            "sin(radians(:lat)) * sin(radians(s.latitude)))) AS distance " +
            "FROM services s " +
            "WHERE s.status = 'ACTIVE' AND s.is_deleted = false " +
            "HAVING distance < :radius " +
            "ORDER BY distance",
            nativeQuery = true)
    List<Object[]> findNearbyServices(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius);

    long countByStatus(ServiceStatus status);

    long countByIsDeletedFalse();
}
