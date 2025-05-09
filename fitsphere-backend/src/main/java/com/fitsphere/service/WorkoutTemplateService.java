package com.fitsphere.service;

import com.fitsphere.model.WorkoutTemplate;
import com.fitsphere.model.User;
import com.fitsphere.model.WorkoutTemplateLike;
import com.fitsphere.model.WorkoutTemplateComment;
import com.fitsphere.repository.WorkoutTemplateRepository;
import com.fitsphere.repository.WorkoutTemplateLikeRepository;
import com.fitsphere.repository.WorkoutTemplateCommentRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutTemplateService {
    private final WorkoutTemplateRepository workoutTemplateRepository;
    private final WorkoutTemplateLikeRepository likeRepository;
    private final WorkoutTemplateCommentRepository commentRepository;
    private final UserRepository userRepository;

    private WorkoutTemplate populateLikeInfo(WorkoutTemplate template, Authentication authentication) {
        long likeCount = likeRepository.countByTemplate(template);
        template.setLikeCount(likeCount);

        if (authentication != null) {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null) {
                boolean likedByUser = likeRepository.findByTemplateAndUser(template, user).isPresent();
                template.setLikedByMe(likedByUser);
            }
        }

        return template;
    }

    private List<WorkoutTemplate> populateLikeInfo(List<WorkoutTemplate> templates, Authentication authentication) {
        return templates.stream()
                .map(template -> populateLikeInfo(template, authentication))
                .collect(Collectors.toList());
    }

    public WorkoutTemplate createTemplate(String name, String description, Integer totalDays, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        WorkoutTemplate template = WorkoutTemplate.builder()
                .name(name)
                .description(description)
                .totalDays(totalDays)
                .user(user)
                .isCompleted(false)
                .isShared(false)
                .build();

        return workoutTemplateRepository.save(template);
    }

    public WorkoutTemplate markDayAsComplete(Long templateId, int day, Authentication authentication) {
        WorkoutTemplate template = workoutTemplateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!template.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not authorized to update this template");
        }

        if (day >= 0 && day < template.getTotalDays()) {
            template.getCompletedDays().set(day, true);
            
            // Check if all days are completed
            boolean allCompleted = template.getCompletedDays().stream().allMatch(completed -> completed);
            if (allCompleted) {
                template.setCompleted(true);
                template.setAchievementMessage(String.format("Completed %s for %d days!", template.getName(), template.getTotalDays()));
            }
            
            return workoutTemplateRepository.save(template);
        } else {
            throw new IllegalArgumentException("Invalid day number");
        }
    }

    public WorkoutTemplate shareAchievement(Long templateId, String personalReflection, Authentication authentication) {
        WorkoutTemplate template = workoutTemplateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!template.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Not authorized to share this template");
        }

        if (!template.isCompleted()) {
            throw new IllegalStateException("Cannot share incomplete template");
        }

        template.setPersonalReflection(personalReflection);
        template.setShared(true);
        return workoutTemplateRepository.save(template);
    }

    public List<WorkoutTemplate> getUserTemplates(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        List<WorkoutTemplate> templates = workoutTemplateRepository.findByUser(user);
        return populateLikeInfo(templates, authentication);
    }

    public List<WorkoutTemplate> getSharedAchievements() {
        List<WorkoutTemplate> templates = workoutTemplateRepository.findByIsSharedTrue();
        return populateLikeInfo(templates, null);
    }

    @Transactional
    public WorkoutTemplate toggleLike(Long templateId, Authentication authentication) {
        WorkoutTemplate template = workoutTemplateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var existingLike = likeRepository.findByTemplateAndUser(template, user);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            var like = WorkoutTemplateLike.builder()
                    .template(template)
                    .user(user)
                    .build();
            likeRepository.save(like);
        }

        return populateLikeInfo(
            workoutTemplateRepository.findById(templateId).get(),
            authentication
        );
    }

    @Transactional
    public WorkoutTemplateComment addComment(Long templateId, String content, Authentication authentication) {
        WorkoutTemplate template = workoutTemplateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var comment = WorkoutTemplateComment.builder()
                .template(template)
                .user(user)
                .content(content)
                .build();

        return commentRepository.save(comment);
    }

    public List<WorkoutTemplateComment> getComments(Long templateId) {
        WorkoutTemplate template = workoutTemplateRepository.findById(templateId)
                .orElseThrow(() -> new EntityNotFoundException("Template not found"));
        return commentRepository.findByTemplateOrderByCreatedAtDesc(template);
    }
}