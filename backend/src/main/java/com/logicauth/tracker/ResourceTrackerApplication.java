package com.logicauth.tracker;

import com.logicauth.tracker.model.User;
import com.logicauth.tracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@EnableMongoRepositories
public class ResourceTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResourceTrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            boolean adminExists = false;
            try {
                adminExists = userRepository.existsByUsername("admin");
            } catch (Exception e) {
                // Ignore if DB not ready
            }
            if (!userRepository.existsByUsername("admin@logicauth.com")) {
                User admin = new User();
                admin.setUsername("admin@logicauth.com");
                admin.setEmail("admin@logicauth.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEnabled(true);
                
                Set<String> roles = new HashSet<>();
                roles.add("ROLE_ADMIN");
                admin.setRoles(roles);
                
                userRepository.save(admin);
                System.out.println("LogicAuth Seed: Created recruiter admin user (admin / admin123)");
            }
        };
    }
}