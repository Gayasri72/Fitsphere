package com.fitsphere.service;

import com.fitsphere.dto.PostDTO;
import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import com.fitsphere.repository.PostRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Post createPost(PostDTO dto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Post post = Post.builder()
                .description(dto.description())
                .mediaUrl(dto.mediaUrl())
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

    public Optional<Post> updatePost(Long postId, PostDTO dto, Authentication authentication) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getUser().getEmail().equals(authentication.getName())) {
            return Optional.empty(); // only author can update
        }
        post.setDescription(dto.description());
        post.setMediaUrl(dto.mediaUrl());
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
