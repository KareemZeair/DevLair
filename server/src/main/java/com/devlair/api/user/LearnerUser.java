package com.devlair.api.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "learner_users")
public class LearnerUser {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(name = "onboarding_completed_at")
    private Instant onboardingCompletedAt;

    protected LearnerUser() {
    }

    public LearnerUser(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Instant getOnboardingCompletedAt() {
        return onboardingCompletedAt;
    }

    public boolean isOnboardingCompleted() {
        return onboardingCompletedAt != null;
    }

    public void completeOnboarding(Instant completedAt) {
        if (this.onboardingCompletedAt == null) {
            this.onboardingCompletedAt = completedAt;
        }
    }
}
