package com.devlair.api.security;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

    /**
     * Creates the CSRF cookie used by the browser before it sends a request
     * that changes server state, including registration and login.
     */
    @GetMapping("/api/csrf")
    CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }
}
