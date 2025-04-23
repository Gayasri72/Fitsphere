package com.fitsphere.dto;

public record AuthenticationRequest(
        String email,
        String password
) {}
