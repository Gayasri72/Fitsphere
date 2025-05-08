package com.fitsphere.service;

import com.fitsphere.dto.ArticleRequest;
import com.fitsphere.model.Article;
import com.fitsphere.model.User;
import com.fitsphere.repository.ArticleRepository;
import com.fitsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Article createArticle(ArticleRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setUser(user);

        return articleRepository.save(article);
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Article> getUserArticles(Long userId) {
        return articleRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }
} 