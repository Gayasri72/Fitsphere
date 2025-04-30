package com.fitsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String mediaUrl;
    private String imageUrl;
    private String videoUrl;
    private LocalDateTime createdAt;

    @ManyToOne
    @JsonIgnoreProperties({"password", "email"}) // Ignore sensitive fields in User
    private User user;

    @ManyToMany
    @JoinTable(
        name = "post_likes",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties({"password", "email"})
    private Set<User> likedBy = new HashSet<>();

    public int getLikeCount() {
        return likedBy.size();
    }
}
