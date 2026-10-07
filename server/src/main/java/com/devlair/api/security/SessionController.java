package com.devlair.api.security;

import com.devlair.api.user.LearnerUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
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

    private SessionResponse sessionFor(String email) {
        var learner = learnerUserRepository.findByEmail(email).orElseThrow();
        return new SessionResponse(learner.getId().toString(), learner.getEmail());
    }

    record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 72) String password) {
    }

    record SessionResponse(String id, String email) {
    }
}
