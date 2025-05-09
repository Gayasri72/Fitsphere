package com.fitsphere.repository;

import com.fitsphere.model.WorkoutTemplateComment;
import com.fitsphere.model.WorkoutTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutTemplateCommentRepository extends JpaRepository<WorkoutTemplateComment, Long> {
    List<WorkoutTemplateComment> findByTemplateOrderByCreatedAtDesc(WorkoutTemplate template);
}