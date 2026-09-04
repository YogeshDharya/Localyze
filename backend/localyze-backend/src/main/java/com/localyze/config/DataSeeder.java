package com.localyze.config;

import com.localyze.entity.User;
import com.localyze.entity.enums.Role;
import com.localyze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@localyze.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@localyze.com")
                    .phone("0000000000")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(admin);
            System.out.println("==========================================================");
            System.out.println("Default Admin user created!");
            System.out.println("Email: admin@localyze.com");
            System.out.println("Password: admin123");
            System.out.println("==========================================================");
        }
    }
}
