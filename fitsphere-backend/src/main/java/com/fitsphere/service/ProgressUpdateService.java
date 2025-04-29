package com.fitsphere.service;

import com.fitsphere.dto.ProgressUpdateDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ProgressUpdateService {
    ProgressUpdateDTO createProgressUpdate(ProgressUpdateDTO progressUpdateDTO, Authentication authentication);
    ProgressUpdateDTO updateProgressUpdate(Long id, ProgressUpdateDTO progressUpdateDTO, Authentication authentication);
    void deleteProgressUpdate(Long id, Authentication authentication);
    List<ProgressUpdateDTO> getProgressUpdatesByUserId(Long userId);
    ProgressUpdateDTO getProgressUpdateById(Long id);
} 