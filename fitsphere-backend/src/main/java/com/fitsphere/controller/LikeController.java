package com.fitsphere.controller;

import com.fitsphere.dto.PostResponseDTO;
import com.fitsphere.model.Post;
import com.fitsphere.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PutMapping("/posts/{postId}/like")
    public ResponseEntity<PostResponseDTO> updateLikeStatus(
            @PathVariable Long postId,
            Authentication authentication) {
        Post post = likeService.updateLikeStatus(postId, authentication);
        return ResponseEntity.ok(PostResponseDTO.fromPost(post));
    }
} 