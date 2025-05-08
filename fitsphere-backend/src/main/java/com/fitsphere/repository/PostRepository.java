package com.fitsphere.repository;

import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
}
