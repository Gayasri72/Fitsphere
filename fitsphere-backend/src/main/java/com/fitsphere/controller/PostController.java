package com.fitsphere.controller;

import com.fitsphere.dto.PostDTO;
import com.fitsphere.model.Post;
import com.fitsphere.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fitsphere.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }
    @PostMapping("/posts")
    public ResponseEntity<Post> createPost(
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "video", required = false) MultipartFile video,
            Authentication authentication) {
        Post post = postService.createPost(description, image, video, authentication);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/user/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        return postService.getUserPosts(userId);
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long postId,
            @RequestBody PostDTO postUpdate,
            Authentication authentication) {
        return postService.updatePost(postId, postUpdate, authentication)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, Authentication authentication) {
        boolean deleted = postService.deletePost(postId, authentication);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.status(403).build();
    }


    @PostMapping("/posts/{postId}/share")
    public ResponseEntity<Post> sharePost(@PathVariable Long postId, Authentication authentication) {
        Post sharedPost = postService.sharePost(postId, authentication);
        return ResponseEntity.ok(sharedPost);
    }
}

