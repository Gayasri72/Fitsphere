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

        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .build();

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        return dto;

    }
}