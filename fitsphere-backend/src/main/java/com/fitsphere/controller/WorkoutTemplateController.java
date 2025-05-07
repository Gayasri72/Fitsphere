package com.fitsphere.controller;

import com.fitsphere.model.WorkoutTemplate;
import com.fitsphere.model.WorkoutTemplateComment;
import com.fitsphere.service.WorkoutTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workout-templates")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WorkoutTemplateController {
    private final WorkoutTemplateService workoutTemplateService;

    @PostMapping
    public ResponseEntity<WorkoutTemplate> createTemplate(
            @RequestBody WorkoutTemplateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.createTemplate(
            request.name(),
            request.description(),
            request.totalDays(),
            authentication));
    }

    @PutMapping("/{templateId}/complete-day/{day}")
    public ResponseEntity<WorkoutTemplate> markDayAsComplete(
            @PathVariable Long templateId,
            @PathVariable int day,
            Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.markDayAsComplete(templateId, day, authentication));
    }

    @PutMapping("/{templateId}/share")
    public ResponseEntity<WorkoutTemplate> shareAchievement(
            @PathVariable Long templateId,
            @RequestParam String personalReflection,
            Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.shareAchievement(templateId, personalReflection, authentication));
    }

    @GetMapping("/user")
    public ResponseEntity<List<WorkoutTemplate>> getUserTemplates(Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.getUserTemplates(authentication));
    }

    @GetMapping("/shared")
    public ResponseEntity<List<WorkoutTemplate>> getSharedAchievements() {
        return ResponseEntity.ok(workoutTemplateService.getSharedAchievements());
    }

    @PostMapping("/{templateId}/like")
    public ResponseEntity<WorkoutTemplate> toggleLike(
            @PathVariable Long templateId,
            Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.toggleLike(templateId, authentication));
    }

    @PostMapping("/{templateId}/comments")
    public ResponseEntity<WorkoutTemplateComment> addComment(
            @PathVariable Long templateId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        return ResponseEntity.ok(workoutTemplateService.addComment(templateId, payload.get("content"), authentication));
    }

    @GetMapping("/{templateId}/comments")
    public ResponseEntity<List<WorkoutTemplateComment>> getComments(@PathVariable Long templateId) {
        return ResponseEntity.ok(workoutTemplateService.getComments(templateId));
    }
}

record WorkoutTemplateRequest(
    String name,
    String description,
    Integer totalDays
) {}