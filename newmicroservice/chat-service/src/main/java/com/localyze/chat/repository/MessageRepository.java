package com.localyze.chat.repository;

import com.localyze.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId1 AND m.receiverId = :userId2) OR (m.senderId = :userId2 AND m.receiverId = :userId1) ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    @Query(value = "SELECT DISTINCT IF(sender_id = :userId, receiver_id, sender_id) FROM messages WHERE sender_id = :userId OR receiver_id = :userId", nativeQuery = true)
    List<Long> findConversationPartners(@Param("userId") Long userId);
    
    long countByReceiverIdAndReadFalse(Long receiverId);
    
    List<Message> findByReceiverIdOrSenderIdOrderByCreatedAtDesc(Long receiverId, Long senderId);
}
