package com.devlair.api.user;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerUserRepository extends JpaRepository<LearnerUser, UUID> {
    Optional<LearnerUser> findByEmail(String email);
}
