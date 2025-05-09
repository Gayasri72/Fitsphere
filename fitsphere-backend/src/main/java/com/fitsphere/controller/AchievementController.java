package com.fitsphere.controller;

import com.fitsphere.dto.AchievementDTO;
import com.fitsphere.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {
    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementDTO>> getAllAchievements() {
        return ResponseEntity.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/user")
    public ResponseEntity<List<AchievementDTO>> getUserAchievements(Authentication authentication) {
        return ResponseEntity.ok(achievementService.getUserAchievements(authentication));
    }

    @PostMapping
    public ResponseEntity<AchievementDTO> createAchievement(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        String exerciseType = (String) request.get("exerciseType");
        Integer daysCompleted = (Integer) request.get("daysCompleted");
        String userReflection = (String) request.get("userReflection");

        return ResponseEntity.ok(achievementService.createAchievement(
                exerciseType, 
                daysCompleted, 
                userReflection, 
                authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AchievementDTO> updateAchievement(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String userReflection = request.get("userReflection");
        return ResponseEntity.ok(achievementService.updateAchievement(id, userReflection, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(
            @PathVariable Long id,
            Authentication authentication) {
        achievementService.deleteAchievement(id, authentication);
        return ResponseEntity.ok().build();
    }
}