package com.fitsphere.repository;

import com.fitsphere.model.WorkoutTemplateLike;
import com.fitsphere.model.WorkoutTemplate;
import com.fitsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WorkoutTemplateLikeRepository extends JpaRepository<WorkoutTemplateLike, Long> {
    Optional<WorkoutTemplateLike> findByTemplateAndUser(WorkoutTemplate template, User user);
    void deleteByTemplateAndUser(WorkoutTemplate template, User user);
    long countByTemplate(WorkoutTemplate template);
}