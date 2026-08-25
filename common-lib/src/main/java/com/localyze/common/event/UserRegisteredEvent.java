package com.localyze.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisteredEvent {
    private Long userId;
    private String email;
    private String name;
    private String role;
    private LocalDateTime registeredAt;
}
