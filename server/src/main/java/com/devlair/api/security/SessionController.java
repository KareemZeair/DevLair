package com.devlair.api.security;

import com.devlair.api.user.LearnerUser;
import com.devlair.api.user.LearnerUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class SessionController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final LearnerUserRepository learnerUserRepository;

    public SessionController(AuthenticationManager authenticationManager, SecurityContextRepository securityContextRepository,
            LearnerUserRepository learnerUserRepository) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.learnerUserRepository = learnerUserRepository;
    }

    @PostMapping("/login")
    ResponseEntity<SessionResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(request.email().trim().toLowerCase(Locale.ROOT), request.password()));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);
        return ResponseEntity.ok(sessionFor(authentication.getName()));
    }

    @GetMapping("/session")
    SessionResponse session(Authentication authentication) {
        return sessionFor(authentication.getName());
    }

    @PostMapping("/onboarding/complete")
    SessionResponse completeOnboarding(Authentication authentication) {
        LearnerUser learner = requireLearner(authentication.getName());
        learner.completeOnboarding(Instant.now());
        learnerUserRepository.save(learner);
        return sessionFor(learner);
    }

    @PostMapping("/logout")
    ResponseEntity<Void> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(AuthenticationException.class)
    ResponseEntity<Map<String, String>> handleBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Email or password is incorrect."));
    }

    private SessionResponse sessionFor(String email) {
        return sessionFor(requireLearner(email));
    }

    private SessionResponse sessionFor(LearnerUser learner) {
        return new SessionResponse(learner.getId().toString(), learner.getEmail(), learner.isOnboardingCompleted());
    }

    private LearnerUser requireLearner(String email) {
        return learnerUserRepository.findByEmail(email).orElseThrow();
    }

    record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 72) String password) {
    }

    public record SessionResponse(String id, String email, boolean onboardingCompleted) {
    }
}
