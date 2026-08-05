package com.localyze.repository;

import com.localyze.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("select m from Message m " +
           "join fetch m.booking b " +
           "join fetch m.sender s " +
           "join fetch m.receiver r " +
           "where b.id = :bookingId " +
           "order by m.createdAt asc")
    List<Message> findByBookingIdOrderByCreatedAtAsc(@Param("bookingId") Long bookingId);

    long countByReceiverIdAndIsReadFalse(Long receiverId);
}
