package com.fitsphere.service;

import com.fitsphere.dto.PostDTO;
import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import com.fitsphere.repository.PostRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

        // Process image file
        if (image != null && !image.isEmpty()) {
            imageUrl = "path/to/uploaded/images/" + image.getOriginalFilename();
            // Save the image file to the server (implementation needed)
        }

        // Process video file
        if (video != null && !video.isEmpty()) {
            videoUrl = "path/to/uploaded/videos/" + video.getOriginalFilename();
            // Save the video file to the server (implementation needed)
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
