package com.fitsphere.repository;

import com.fitsphere.model.WorkoutTemplate;
import com.fitsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutTemplateRepository extends JpaRepository<WorkoutTemplate, Long> {
    List<WorkoutTemplate> findByUser(User user);
    List<WorkoutTemplate> findByIsSharedTrue();
}