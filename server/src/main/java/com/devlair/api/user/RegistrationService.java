package com.devlair.api.user;

import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final LearnerUserRepository learnerUserRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(LearnerUserRepository learnerUserRepository, PasswordEncoder passwordEncoder) {
        this.learnerUserRepository = learnerUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegisteredLearner register(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        if (learnerUserRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyRegisteredException();
        }

        LearnerUser learnerUser = learnerUserRepository.save(
                new LearnerUser(normalizedEmail, passwordEncoder.encode(password)));
        return new RegisteredLearner(learnerUser.getId(), learnerUser.getEmail());
    }

    public record RegisteredLearner(java.util.UUID id, String email) {
    }
}
