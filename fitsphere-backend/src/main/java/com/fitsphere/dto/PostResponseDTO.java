package com.fitsphere.dto;

import com.fitsphere.model.Post;
import com.fitsphere.model.User;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class PostResponseDTO {
    private Long id;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private LocalDateTime createdAt;
    private UserDTO user;
    private Set<Long> likedBy;
    private int likeCount;

    public static PostResponseDTO fromPost(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setDescription(post.getDescription());
        dto.setImageUrl(post.getImageUrl());
        dto.setVideoUrl(post.getVideoUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUser(UserDTO.fromUser(post.getUser()));
        dto.setLikedBy(post.getLikedBy().stream()
                .map(User::getId)
                .collect(java.util.stream.Collectors.toSet()));
        dto.setLikeCount(post.getLikedBy().size());
        return dto;
    }
} 