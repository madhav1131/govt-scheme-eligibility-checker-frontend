package in.gov.eligibility.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.gov.eligibility.model.SchemeEntity;
import in.gov.eligibility.model.UserEntity;
import in.gov.eligibility.repository.SchemeRepository;
import in.gov.eligibility.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SeedDataService implements CommandLineRunner {
    private final UserRepository users;
    private final SchemeRepository schemes;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public SeedDataService(UserRepository users, SchemeRepository schemes,
                           PasswordEncoder passwordEncoder, ObjectMapper objectMapper) {
        this.users = users;
        this.schemes = schemes;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!users.existsByEmailIgnoreCase("admin@janseva.local")) {
            users.save(new UserEntity(UUID.randomUUID().toString(), "System Admin", "admin@janseva.local",
                    passwordEncoder.encode("admin123"), "admin", Map.of()));
        }
        if (!users.existsByEmailIgnoreCase("rahul@example.com")) {
            users.save(new UserEntity(UUID.randomUUID().toString(), "Rahul Sharma", "rahul@example.com",
                    passwordEncoder.encode("user123"), "user", Map.of(
                    "age", 24, "gender", "Male", "income", 180000, "category", "OBC",
                    "state", "Uttar Pradesh", "occupation", "Student", "isStudent", true,
                    "isDisability", false, "urbanRural", "Rural")));
        }

        if (schemes.count() == 0) {
            try (InputStream input = getClass().getResourceAsStream("/schemes.json")) {
                if (input == null) throw new IllegalStateException("Missing built-in schemes resource");
                List<Map<String, Object>> seedSchemes =
                        objectMapper.readValue(input, new TypeReference<>() {});
                for (Map<String, Object> data : seedSchemes) {
                    SchemeEntity scheme = new SchemeEntity();
                    applySchemeData(scheme, data);
                    schemes.save(scheme);
                }
            }
        }
    }

    private void applySchemeData(SchemeEntity scheme, Map<String, Object> data) {
        scheme.setId(value(data, "id", UUID.randomUUID().toString()));
        scheme.setTitle(value(data, "title", ""));
        scheme.setTitleHi(value(data, "titleHi", null));
        scheme.setCategory(value(data, "category", "General"));
        scheme.setMinistry(value(data, "ministry", ""));
        scheme.setDescription(value(data, "description", ""));
        scheme.setDescriptionHi(value(data, "descriptionHi", null));
        scheme.setBenefits(value(data, "benefits", ""));
        scheme.setBenefitAmount(value(data, "benefitAmount", "0"));
        scheme.setEligibilityCriteria(objectMapper.convertValue(data.get("eligibilityCriteria"), new TypeReference<>() {}));
        scheme.setDocumentsRequired(objectMapper.convertValue(data.get("documentsRequired"), new TypeReference<>() {}));
        scheme.setApplicationUrl(value(data, "applicationUrl", "#"));
        scheme.setDeadline(value(data, "deadline", ""));
        scheme.setActive(!Boolean.FALSE.equals(data.get("active")));
        scheme.setCreatedAt(java.time.LocalDateTime.now());
        scheme.setUpdatedAt(scheme.getCreatedAt());
    }

    private String value(Map<String, Object> data, String key, String fallback) {
        Object value = data.get(key);
        return value == null ? fallback : value.toString();
    }
}
