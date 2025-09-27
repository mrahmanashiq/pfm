package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mra_pfm.pfm.dto.auth.JwtAuthenticationResponse;
import mra_pfm.pfm.dto.auth.LoginRequest;
import mra_pfm.pfm.dto.auth.SignUpRequest;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.entity.UserProfile;
import mra_pfm.pfm.repository.UserRepository;
import mra_pfm.pfm.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    
    @Transactional
    public JwtAuthenticationResponse signUp(SignUpRequest signUpRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // Validate password confirmation
        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
            throw new RuntimeException("Error: Password confirmation doesn't match!");
        }
        
        // Create user profile
        UserProfile userProfile = UserProfile.builder()
                .displayName(signUpRequest.getName())
                .defaultCurrency("USD")
                .notificationEnabled(true)
                .darkModeEnabled(false)
                .build();
        
        // Create new user
        Users user = Users.builder()
                .name(signUpRequest.getName())
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .mobileNumber(signUpRequest.getMobileNumber())
                .address(signUpRequest.getAddress())
                .role(Users.Role.USER)
                .userType(Users.UserType.NORMAL)
                .status(Users.Status.ACTIVE)
                .emailVerified(false)
                .twoFactorEnabled(false)
                .userProfile(userProfile)
                .build();
        
        userProfile.setUser(user);
        Users savedUser = userRepository.save(user);
        
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getUsername(),
                        signUpRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT tokens
        String accessToken = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);
        
        return JwtAuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400L) // 24 hours
                .user(JwtAuthenticationResponse.UserInfo.builder()
                        .id(savedUser.getId())
                        .name(savedUser.getName())
                        .username(savedUser.getUsername())
                        .email(savedUser.getEmail())
                        .role(savedUser.getRole().name())
                        .status(savedUser.getStatus().name())
                        .emailVerified(savedUser.getEmailVerified())
                        .build())
                .build();
    }
    
    @Transactional(readOnly = true)
    public JwtAuthenticationResponse signIn(LoginRequest loginRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Get user details
        Users user = userRepository.findByUsernameOrEmail(
                loginRequest.getUsernameOrEmail(),
                loginRequest.getUsernameOrEmail()
        ).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate JWT tokens
        String accessToken = jwtUtils.generateJwtToken(authentication);
        String refreshToken = jwtUtils.generateRefreshToken(authentication);
        
        return JwtAuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400L) // 24 hours
                .user(JwtAuthenticationResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .emailVerified(user.getEmailVerified())
                        .build())
                .build();
    }
    
    public JwtAuthenticationResponse refreshToken(String refreshToken) {
        // Validate refresh token
        if (!jwtUtils.validateJwtToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        // Get username from token
        String username = jwtUtils.getUsernameFromJwtToken(refreshToken);
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create authentication object
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, null);
        
        // Generate new access token
        String newAccessToken = jwtUtils.generateJwtToken(authentication);
        
        return JwtAuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Keep the same refresh token
                .expiresIn(86400L)
                .user(JwtAuthenticationResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .status(user.getStatus().name())
                        .emailVerified(user.getEmailVerified())
                        .build())
                .build();
    }
    
    public void forgotPassword(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        
        // In a real application, you would:
        // 1. Store the reset token in database with expiration
        // 2. Send email with reset link
        log.info("Password reset token for user {}: {}", email, resetToken);
    }
    
    public void resetPassword(String token, String newPassword) {
        // In a real application, you would:
        // 1. Validate the reset token
        // 2. Check if token is not expired
        // 3. Update user password
        log.info("Password reset with token: {}", token);
    }
    
    public void verifyEmail(String token) {
        // In a real application, you would:
        // 1. Validate the verification token
        // 2. Mark user email as verified
        log.info("Email verification with token: {}", token);
    }
}