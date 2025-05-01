package com.fitsphere.repository;

import com.fitsphere.model.ProgressUpdate;
import com.fitsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressUpdateRepository extends JpaRepository<ProgressUpdate, Long> {
    List<ProgressUpdate> findByUser(User user);
    List<ProgressUpdate> findByUserAndAchievementId(User user, String achievementId);
} 