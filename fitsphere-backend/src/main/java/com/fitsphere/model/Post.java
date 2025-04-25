package com.fitsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
}
