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

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
            File uploadDir = new File("uploads/images");
            if (!uploadDir.exists()) uploadDir.mkdirs();
            File dest = new File(uploadDir, fileName);
            profileImage.transferTo(dest);
            user.setProfileImageUrl("/images/" + fileName);
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
}
