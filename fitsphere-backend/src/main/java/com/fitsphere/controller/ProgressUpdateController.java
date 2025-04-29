package com.fitsphere.controller;

import com.fitsphere.dto.ProgressUpdateDTO;
import com.fitsphere.service.ProgressUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
@RequiredArgsConstructor
public class ProgressUpdateController {

    private final ProgressUpdateService progressUpdateService;

    @PostMapping
    public ResponseEntity<ProgressUpdateDTO> createProgressUpdate(
            @RequestBody ProgressUpdateDTO progressUpdateDTO,
            Authentication authentication) {
        return ResponseEntity.ok(progressUpdateService.createProgressUpdate(progressUpdateDTO, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO> updateProgressUpdate(
            @PathVariable Long id,
            @RequestBody ProgressUpdateDTO progressUpdateDTO,
            Authentication authentication) {
        return ResponseEntity.ok(progressUpdateService.updateProgressUpdate(id, progressUpdateDTO, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(
            @PathVariable Long id,
            Authentication authentication) {
        progressUpdateService.deleteProgressUpdate(id, authentication);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressUpdateDTO>> getProgressUpdatesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(progressUpdateService.getProgressUpdatesByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressUpdateDTO> getProgressUpdateById(@PathVariable Long id) {
        return ResponseEntity.ok(progressUpdateService.getProgressUpdateById(id));
    }
} 