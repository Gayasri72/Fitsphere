package com.fitsphere.service;

import com.fitsphere.dto.AchievementDTO;
import com.fitsphere.model.Achievement;
import com.fitsphere.model.User;
import com.fitsphere.repository.AchievementRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public List<AchievementDTO> getAllAchievements() {
        return achievementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AchievementDTO::fromAchievement)
                .collect(Collectors.toList());
    }

    public List<AchievementDTO> getUserAchievements(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return achievementRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(AchievementDTO::fromAchievement)
                .collect(Collectors.toList());
    }

    @Transactional
    public AchievementDTO createAchievement(
            String exerciseType,
            Integer daysCompleted,
            String userReflection,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String title = generateTitle(exerciseType, daysCompleted);
        String description = generateDescription(exerciseType, daysCompleted);

        Achievement achievement = Achievement.builder()
                .title(title)
                .description(description)
                .exerciseType(exerciseType)
                .daysCompleted(daysCompleted)
                .userReflection(userReflection)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        achievement = achievementRepository.save(achievement);
        return AchievementDTO.fromAchievement(achievement);
    }

    @Transactional
    public AchievementDTO updateAchievement(Long id, String userReflection, Authentication authentication) {
        Achievement achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!achievement.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this achievement");
        }

        achievement.setUserReflection(userReflection);
        achievement = achievementRepository.save(achievement);
        return AchievementDTO.fromAchievement(achievement);
    }

    @Transactional
    public void deleteAchievement(Long id, Authentication authentication) {
        Achievement achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!achievement.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this achievement");
        }

        achievementRepository.delete(achievement);
    }

    private String generateTitle(String exerciseType, int daysCompleted) {
        String level;
        if (daysCompleted >= 30) {
            level = "Master";
        } else if (daysCompleted >= 20) {
            level = "Expert";
        } else if (daysCompleted >= 10) {
            level = "Intermediate";
        } else {
            level = "Beginner";
        }

        return level + " " + capitalizeFirstLetter(exerciseType);
    }

    private String generateDescription(String exerciseType, int daysCompleted) {
        return String.format("Completed %d days of %s training", daysCompleted, exerciseType.toLowerCase());
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
}