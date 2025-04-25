package com.fitsphere.service;

import com.fitsphere.dto.PostDTO;
import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import com.fitsphere.repository.PostRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Post createPost(String description, MultipartFile image, MultipartFile video, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        String imageUrl = null;
        String videoUrl = null;

        // Save image file if present
        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
            File uploadDir = new File("uploads/images");
            File dest = new File(uploadDir, fileName);
            File parentDir = dest.getParentFile();
            if (!parentDir.exists()) parentDir.mkdirs();
            try {
                image.transferTo(dest);
                imageUrl = "/images/" + fileName;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image file", e);
            }
        }

        // Save video file if present
        if (video != null && !video.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(video.getOriginalFilename());
            File uploadDir = new File("uploads/videos");
            File dest = new File(uploadDir, fileName);
            File parentDir = dest.getParentFile();
            if (!parentDir.exists()) parentDir.mkdirs();
            try {
                video.transferTo(dest);
                videoUrl = "/videos/" + fileName;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save video file", e);
            }
        }

        Post post = Post.builder()
                .description(description)
                .imageUrl(imageUrl)
                .videoUrl(videoUrl)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getUserPosts(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return postRepository.findByUser(user);
    }

    public List<Post> getUserPostsByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return postRepository.findByUser(user);
    }

    public Optional<Post> updatePost(Long postId, PostDTO dto, Authentication authentication) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getUser().getEmail().equals(authentication.getName())) {
            return Optional.empty(); // only author can update
        }
        post.setDescription(dto.getDescription());
        post.setImageUrl(dto.getImageUrl());
        post.setVideoUrl(dto.getVideoUrl());
        return Optional.of(postRepository.save(post));
    }

    public boolean deletePost(Long postId, Authentication authentication) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getUser().getEmail().equals(authentication.getName())) {
            return false;
        }
        postRepository.delete(post);
        return true;
    }
}
