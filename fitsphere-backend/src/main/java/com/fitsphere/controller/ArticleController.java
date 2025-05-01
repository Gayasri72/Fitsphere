package com.fitsphere.controller;

import com.fitsphere.model.Article;
import com.fitsphere.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Article>> getArticlesByTag(@PathVariable String tag) {
        return ResponseEntity.ok(articleService.getArticlesByTag(tag));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article);
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody Article article, @AuthenticationPrincipal Jwt jwt) {
        try {
            String username = jwt.getSubject();
            Article createdArticle = articleService.createArticle(article, username);
            return ResponseEntity.ok(createdArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody Article article, @AuthenticationPrincipal Jwt jwt) {
        try {
            String username = jwt.getSubject();
            Article updatedArticle = articleService.updateArticle(id, article, username);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        try {
            String username = jwt.getSubject();
            articleService.deleteArticle(id, username);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 