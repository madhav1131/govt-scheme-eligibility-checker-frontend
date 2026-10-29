package in.gov.eligibility.controller;

import in.gov.eligibility.config.JwtService;
import in.gov.eligibility.model.SavedSchemeEntity;
import in.gov.eligibility.model.UserEntity;
import in.gov.eligibility.repository.SavedSchemeRepository;
import in.gov.eligibility.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final SavedSchemeRepository savedSchemes;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository users, SavedSchemeRepository savedSchemes,
                          PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.savedSchemes = savedSchemes;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists with this email");
        }
        UserEntity user = users.save(new UserEntity(UUID.randomUUID().toString(), request.name().trim(), email,
                passwordEncoder.encode(request.password()), "user", Map.of()));
        return Map.of("success", true, "token", jwtService.createToken(user), "user", publicUser(user, false));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        UserEntity user = users.findByEmailIgnoreCase(request.email().trim())
                .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        return Map.of("success", true, "token", jwtService.createToken(user), "user", publicUser(user, true));
    }

    @PostMapping("/bookmark")
    public Map<String, Object> toggleBookmark(
            org.springframework.security.core.Authentication authentication,
            @RequestBody BookmarkRequest request) {
        if (request.schemeId() == null || request.schemeTitle() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Scheme ID and title are required");
        }
        var existing = savedSchemes.findByUserIdAndSchemeId(authentication.getName(), request.schemeId());
        if (existing.isPresent()) {
            savedSchemes.delete(existing.get());
            return Map.of("success", true, "isBookmarked", false, "message", "Bookmark removed");
        }
        savedSchemes.save(new SavedSchemeEntity(authentication.getName(), request.schemeId(),
                request.schemeTitle(), request.category(), request.benefits()));
        return Map.of("success", true, "isBookmarked", true, "message", "Scheme saved successfully");
    }

    @GetMapping("/saved")
    public Map<String, Object> getSavedSchemes(
            org.springframework.security.core.Authentication authentication) {
        return Map.of("success", true, "savedSchemes", savedSchemes.findByUserId(authentication.getName()));
    }

    private Map<String, Object> publicUser(UserEntity user, boolean includeProfile) {
        var result = new java.util.LinkedHashMap<String, Object>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        if (includeProfile) result.put("profile", user.getProfile() == null ? Map.of() : user.getProfile());
        return result;
    }

    public record RegisterRequest(@NotBlank @Size(max = 120) String name,
                                  @NotBlank @Email @Size(max = 190) String email,
                                  @NotBlank @Size(min = 6, max = 100) String password,
                                  String role) {}

    public record LoginRequest(@NotBlank @Email @Size(max = 190) String email,
                               @NotBlank String password) {}

    public record BookmarkRequest(String schemeId, String schemeTitle, String category, String benefits) {}
}
