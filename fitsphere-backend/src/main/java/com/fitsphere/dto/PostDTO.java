package com.fitsphere.dto;

import java.time.LocalDateTime;

public record PostDTO(
        Long id,
        String description,
        String mediaUrl,
        LocalDateTime createdAt,
        Long userId
) {}
