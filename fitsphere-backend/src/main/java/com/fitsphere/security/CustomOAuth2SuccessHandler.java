package com.fitsphere.security;

import com.fitsphere.model.User;
import com.fitsphere.repository.UserRepository;
import com.fitsphere.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String picture = oAuth2User.getAttribute("picture");

        // Find or create user
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .profileImageUrl(picture) // Save Google profile photo
                    .password("") // No password for OAuth users
                    .build();
            return userRepository.save(newUser);
        });
        // Update profile image if changed
        if (picture != null && (user.getProfileImageUrl() == null || !picture.equals(user.getProfileImageUrl()))) {
            user.setProfileImageUrl(picture);
            userRepository.save(user);
        }

        // Generate JWT with user ID and profile image
        var extraClaims = java.util.Map.of(
            "id", (Object) user.getId(),
            "profileImageUrl", user.getProfileImageUrl()
        );
        String token = jwtService.generateToken(extraClaims, user);

        // Redirect to frontend with token
        String redirectUrl = "http://localhost:5173/oauth-callback?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}
