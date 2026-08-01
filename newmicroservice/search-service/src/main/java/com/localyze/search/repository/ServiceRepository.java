package com.localyze.search.repository;

import com.localyze.common.enums.ServiceStatus;
import com.localyze.search.entity.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Page<ServiceEntity> findByProviderId(Long providerId, Pageable pageable);
    
    Page<ServiceEntity> findByCategoryIdAndStatus(Long categoryId, ServiceStatus status, Pageable pageable);
    
    Page<ServiceEntity> findByStatus(ServiceStatus status, Pageable pageable);
    
    int countByCategoryId(Long categoryId);
    
    @Query("SELECT s FROM ServiceEntity s WHERE s.status = :status AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ServiceEntity> searchByTextAndStatus(@Param("query") String query, 
                                              @Param("status") ServiceStatus status, 
                                              Pageable pageable);
}
