package com.fitsphere.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.fitsphere.model.User;
import com.fitsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateUser(Long userId, User updatedUser, Authentication authentication) {
        User user = userRepository.findById(userId).orElseThrow();
        if (!user.getEmail().equals(authentication.getName())) {
            throw new SecurityException("Unauthorized to update this user");
        }
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
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
