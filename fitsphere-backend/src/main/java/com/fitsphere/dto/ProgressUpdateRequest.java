package com.fitsphere.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressUpdateRequest {
    @NotBlank
    private String achievementId;
    
    @NotNull
    private Double progress;
    
    private String notes;
    
    @NotBlank
    private String unit;
} 