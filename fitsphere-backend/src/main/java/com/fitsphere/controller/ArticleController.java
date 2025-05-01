package com.fitsphere.controller;

import com.fitsphere.model.Article;
import com.fitsphere.repository.ArticleRepository;
import com.fitsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Article>> getArticlesByTag(@PathVariable String tag) {
        List<Article> articles = articleRepository.findByTag(tag);
        return ResponseEntity.ok(articles);
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article, Authentication authentication) {
        String username = authentication.getName();
        article.setAuthor(userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found")));
        return ResponseEntity.ok(articleRepository.save(article));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 