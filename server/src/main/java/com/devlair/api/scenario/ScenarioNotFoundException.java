package com.devlair.api.scenario;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ScenarioNotFoundException extends RuntimeException {

    public ScenarioNotFoundException(String slug) {
        super("No scenario exists for slug: " + slug);
    }
}
