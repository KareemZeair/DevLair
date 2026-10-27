package com.sidekicksupply.web;

import com.sidekicksupply.checkout.PaymentDeclinedException;
import com.sidekicksupply.inventory.InsufficientInventoryException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class ApiExceptionHandler {
    @ExceptionHandler({IllegalArgumentException.class, InsufficientInventoryException.class, PaymentDeclinedException.class})
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    Map<String, String> invalidRequest(RuntimeException exception) { return Map.of("message", exception.getMessage()); }
}
