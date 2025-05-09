package com.fitsphere.dto;

import com.fitsphere.model.User;

import lombok.Builder;

import lombok.AllArgsConstructor;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@Builder

@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String profileImageUrl;

    public static UserDTO fromUser(User user) {
        if (user == null) {
            return null;
        }
        
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName() != null ? user.getFirstName() : "")
                .lastName(user.getLastName() != null ? user.getLastName() : "")
                .email(user.getEmail() != null ? user.getEmail() : "")
                .profileImageUrl(user.getProfileImageUrl() != null ? user.getProfileImageUrl() : "")
                .build();
    }
}