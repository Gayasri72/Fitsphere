package com.fitsphere.controller;

import com.fitsphere.dto.PostDTO;
import com.fitsphere.model.Post;
import com.fitsphere.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO postDTO, Authentication authentication) {
        return ResponseEntity.ok(postService.createPost(postDTO, authentication));
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long postId,
            @RequestBody PostDTO postDTO,
            Authentication authentication
    ) {
        return postService.updatePost(postId, postDTO, authentication)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(403).body("Unauthorized"));
    }
    

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            Authentication authentication
    ) {
        return postService.deletePost(postId, authentication)
                ? ResponseEntity.ok("Post deleted")
                : ResponseEntity.status(403).body("Unauthorized");
    }
}
