package com.fitsphere.controller;

import com.fitsphere.dto.ArticleRequest;
import com.fitsphere.model.Article;
import com.fitsphere.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:5173")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(
            @RequestBody ArticleRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        Article article = articleService.createArticle(request, userEmail);
        return ResponseEntity.ok(article);
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Article>> getUserArticles(@PathVariable Long userId) {
        List<Article> articles = articleService.getUserArticles(userId);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }
} 