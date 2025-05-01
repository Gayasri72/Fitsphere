package com.fitsphere.controller;

import com.fitsphere.dto.ProgressUpdateRequest;
import com.fitsphere.model.ProgressUpdate;
import com.fitsphere.model.User;
import com.fitsphere.repository.ProgressUpdateRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProgressUpdateController {

    private final ProgressUpdateRepository progressUpdateRepository;
    private final UserRepository userRepository;

    @PostMapping("/progress-updates")
    public ResponseEntity<ProgressUpdate> createProgressUpdate(
            @RequestBody ProgressUpdateRequest request,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProgressUpdate progressUpdate = ProgressUpdate.builder()
                .achievementId(request.getAchievementId())
                .progress(request.getProgress())
                .unit(request.getUnit())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return ResponseEntity.ok(progressUpdateRepository.save(progressUpdate));
    }

    @GetMapping("/progress-updates")
    public ResponseEntity<List<ProgressUpdate>> getUserProgressUpdates(
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(progressUpdateRepository.findByUser(user));
    }

    @GetMapping("/progress-updates/{achievementId}")
    public ResponseEntity<List<ProgressUpdate>> getUserProgressUpdatesByAchievement(
            @PathVariable String achievementId,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(progressUpdateRepository.findByUserAndAchievementId(user, achievementId));
    }
} 