package com.fitsphere.service;

import com.fitsphere.model.Article;
import com.fitsphere.model.User;
import com.fitsphere.repository.ArticleRepository;
import com.fitsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Article> getAllArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Article> getArticlesByTag(String tag) {
        return articleRepository.findByTag(tag);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public Article createArticle(Article article, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        article.setAuthor(author);
        return articleRepository.save(article);
    }

    public Article updateArticle(Long id, Article article, String username) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!existingArticle.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this article");
        }

        existingArticle.setTitle(article.getTitle());
        existingArticle.setContent(article.getContent());
        existingArticle.setTag(article.getTag());

        return articleRepository.save(existingArticle);
    }

    public void deleteArticle(Long id, String username) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!article.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this article");
        }

        articleRepository.delete(article);
    }
}