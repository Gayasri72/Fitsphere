package com.fitsphere.dto;

import com.fitsphere.model.Achievement;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AchievementDTO {
    private Long id;
    private String title;
    private String description;
    private String exerciseType;
    private int daysCompleted;
    private String userReflection;
    private LocalDateTime createdAt;
    private UserDTO user;

    public static AchievementDTO fromAchievement(Achievement achievement) {
        return AchievementDTO.builder()
                .id(achievement.getId())
                .title(achievement.getTitle())
                .description(achievement.getDescription())
                .exerciseType(achievement.getExerciseType())
                .daysCompleted(achievement.getDaysCompleted())
                .userReflection(achievement.getUserReflection())
                .createdAt(achievement.getCreatedAt())
                .user(UserDTO.fromUser(achievement.getUser()))
                .build();
    }
}