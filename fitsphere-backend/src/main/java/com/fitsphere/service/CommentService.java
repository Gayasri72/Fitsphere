package com.fitsphere.service;

import com.fitsphere.dto.CommentDTO;
import org.springframework.security.core.Authentication;
import java.util.List;

public interface CommentService {
    CommentDTO createComment(Long postId, String content, Authentication authentication);
    List<CommentDTO> getCommentsByPostId(Long postId);
    void deleteComment(Long commentId, Authentication authentication);
} 