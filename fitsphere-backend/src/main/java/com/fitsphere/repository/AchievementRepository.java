package com.fitsphere.repository;

import com.fitsphere.model.Achievement;
import com.fitsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserOrderByCreatedAtDesc(User user);
    List<Achievement> findAllByOrderByCreatedAtDesc();
}