package com.devlair.api.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private LearnerUserRepository learnerUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RegistrationService registrationService;

    @Test
    void normalizesEmailAndHashesPasswordBeforeSaving() {
        when(learnerUserRepository.findByEmail("dev@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("safepassword")).thenReturn("hashed-password");
        when(learnerUserRepository.save(any(LearnerUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RegistrationService.RegisteredLearner learner = registrationService.register(" Dev@Example.com ", "safepassword");

        assertThat(learner.email()).isEqualTo("dev@example.com");
    }

    @Test
    void rejectsAnExistingEmail() {
        when(learnerUserRepository.findByEmail("dev@example.com")).thenReturn(Optional.of(new LearnerUser("dev@example.com", "hash")));

        assertThatThrownBy(() -> registrationService.register("dev@example.com", "safepassword"))
                .isInstanceOf(EmailAlreadyRegisteredException.class);
    }
}
