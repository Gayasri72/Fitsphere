package com.fitsphere.service;

import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import com.fitsphere.repository.PostRepository;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public Post updateLikeStatus(Long postId, Authentication authentication) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        
        if (post.getLikedBy().contains(user)) {
            post.getLikedBy().remove(user);
        } else {
            post.getLikedBy().add(user);
        }
        
        return postRepository.save(post);
    }
} 