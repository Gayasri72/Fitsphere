package com.fitsphere.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "workout_templates")
public class WorkoutTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Integer totalDays;

    @ElementCollection
    @Builder.Default
    private List<Boolean> completedDays = new ArrayList<>();

    @ManyToOne
    private User user;

    private boolean isCompleted;
    private String achievementMessage;
    private String personalReflection;
    private boolean isShared;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkoutTemplateLike> likes = new ArrayList<>();

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<WorkoutTemplateComment> comments = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        for (int i = 0; i < totalDays; i++) {
            completedDays.add(false);
        }
    }

    @Transient
    private long likeCount;

    @Transient
    private boolean likedByMe;

    public void setLikeCount(long count) {
        this.likeCount = count;
    }

    public void setLikedByMe(boolean liked) {
        this.likedByMe = liked;
    }
}