package com.fitsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateDTO {
    private Long id;
    private Long userId;
    private String templateType;
    private String title;
    private String details;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO user;
} 