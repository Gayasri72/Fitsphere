package com.fitsphere.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.fitsphere.model.User;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private static final String BACKEND_URL = "http://localhost:8081";

    public User updateUser(Long userId, String firstName, String lastName, String email, MultipartFile profileImage, Authentication authentication) throws IOException {
        User user = userRepository.findById(userId).orElseThrow();
        if (!user.getEmail().equals(authentication.getName())) {
            throw new SecurityException("Unauthorized to update this user");
        }
        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName);
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName);
        }
        if (email != null && !email.trim().isEmpty()) {
            user.setEmail(email);
        }
        if (profileImage != null && !profileImage.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(profileImage.getOriginalFilename());
            File uploadDir = new File(System.getProperty("user.dir"), "uploads/images");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            File dest = new File(uploadDir, fileName);
            try {
                profileImage.transferTo(dest);
                user.setProfileImageUrl(BACKEND_URL + "/images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save profile image", e);
            }
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long userId, Authentication authentication) {
        User user = userRepository.findById(userId).orElseThrow();
        if (!user.getEmail().equals(authentication.getName())) {
            throw new SecurityException("Unauthorized to delete this user");
        }
        userRepository.delete(user);
    }

    public List<User> getAllUsersExcept(String email) {
        if (email == null) return userRepository.findAll();
        return userRepository.findAll().stream()
                .filter(u -> !u.getEmail().equals(email))
                .toList();
    }
}