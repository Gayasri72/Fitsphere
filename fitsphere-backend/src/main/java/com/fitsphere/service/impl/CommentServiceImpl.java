package com.fitsphere.service.impl;

import com.fitsphere.dto.CommentDTO;
import com.fitsphere.dto.UserDTO;
import com.fitsphere.model.Comment;
import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import com.fitsphere.repository.CommentRepository;
import com.fitsphere.repository.PostRepository;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CommentDTO createComment(Long postId, String content, Authentication authentication) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Authentication authentication) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!comment.getUser().getId().equals(currentUser.getId()) && 
            !comment.getPost().getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional
    public CommentDTO updateComment(Long commentId, String content, Authentication authentication) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Not authorized to update this comment");
        }

        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return convertToDTO(updatedComment);
    }

    private CommentDTO convertToDTO(Comment comment) {

//         UserDTO userDTO = UserDTO.builder()
//             .id(comment.getUser().getId())
//             .firstName(comment.getUser().getFirstName())
//             .lastName(comment.getUser().getLastName())
//             .email(comment.getUser().getEmail())
//             .profileImageUrl(comment.getUser().getProfileImageUrl())
//             .build();

        UserDTO userDTO = UserDTO.fromUser(comment.getUser());


        return new CommentDTO(
            comment.getId(),
            comment.getContent(),
            userDTO,
            comment.getPost().getId(),
            comment.getCreatedAt()
        );
    }
} 