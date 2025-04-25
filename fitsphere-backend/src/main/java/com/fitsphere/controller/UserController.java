package com.fitsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fitsphere.model.User;
import com.fitsphere.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser, Authentication authentication) {
        User user = userService.updateUser(userId, updatedUser, authentication);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId, Authentication authentication) {
        userService.deleteUser(userId, authentication);
        return ResponseEntity.ok("User deleted successfully");
    }
}