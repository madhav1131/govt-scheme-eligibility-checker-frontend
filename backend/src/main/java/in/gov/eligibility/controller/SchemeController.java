package in.gov.eligibility.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.gov.eligibility.model.SchemeEntity;
import in.gov.eligibility.repository.SchemeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {
    private final SchemeRepository schemes;
    private final ObjectMapper objectMapper;

    public SchemeController(SchemeRepository schemes, ObjectMapper objectMapper) {
        this.schemes = schemes;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public Map<String, Object> getSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String targetGroup) {
        List<SchemeEntity> filtered = new ArrayList<>(schemes.findByActiveTrue());
        if (category != null && !category.equalsIgnoreCase("All")) {
            filtered.removeIf(scheme -> !scheme.getCategory().equalsIgnoreCase(category));
        }
        if (search != null && !search.isBlank()) {
            String query = search.toLowerCase();
            filtered.removeIf(scheme -> !contains(scheme.getTitle(), query)
                    && !contains(scheme.getTitleHi(), query)
                    && !contains(scheme.getDescription(), query)
                    && !contains(scheme.getMinistry(), query));
        }
        if (targetGroup != null && !targetGroup.equalsIgnoreCase("All")) {
            filtered.removeIf(scheme -> {
                List<String> occupations = scheme.getEligibilityCriteria() == null ? List.of()
                        : stringList(scheme.getEligibilityCriteria().get("occupations"));
                return !occupations.contains("All") && !occupations.contains(targetGroup);
            });
        }
        return Map.of("success", true, "count", filtered.size(), "schemes", filtered);
    }

    @GetMapping("/{id}")
    public Map<String, Object> getScheme(@PathVariable String id) {
        SchemeEntity scheme = schemes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Scheme not found"));
        return Map.of("success", true, "scheme", scheme);
    }

    @PostMapping
    public Map<String, Object> createScheme(@RequestBody Map<String, Object> body) {
        SchemeEntity scheme = new SchemeEntity();
        scheme.setId("scheme-" + UUID.randomUUID());
        scheme.setCreatedAt(LocalDateTime.now());
        apply(scheme, body);
        return Map.of("success", true, "scheme", schemes.save(scheme));
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateScheme(@PathVariable String id, @RequestBody Map<String, Object> body) {
        SchemeEntity scheme = schemes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Scheme not found"));
        apply(scheme, body);
        return Map.of("success", true, "scheme", schemes.save(scheme));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteScheme(@PathVariable String id) {
        if (!schemes.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Scheme not found");
        }
        schemes.deleteById(id);
        return Map.of("success", true, "message", "Scheme removed successfully");
    }

    private void apply(SchemeEntity scheme, Map<String, Object> data) {
        scheme.setTitle(requiredText(data, "title"));
        scheme.setTitleHi(text(data.get("titleHi"), null));
        scheme.setCategory(requiredText(data, "category"));
        scheme.setMinistry(requiredText(data, "ministry"));
        scheme.setDescription(requiredText(data, "description"));
        scheme.setDescriptionHi(text(data.get("descriptionHi"), null));
        scheme.setBenefits(requiredText(data, "benefits"));
        scheme.setBenefitAmount(text(data.get("benefitAmount"), "0"));
        Object criteria = data.get("eligibilityCriteria");
        scheme.setEligibilityCriteria(criteria == null ? Map.of()
                : objectMapper.convertValue(criteria, objectMapper.getTypeFactory()
                .constructMapType(LinkedHashMap.class, String.class, Object.class)));
        Object documents = data.get("documentsRequired");
        scheme.setDocumentsRequired(documents == null ? List.of() : stringList(documents));
        scheme.setApplicationUrl(text(data.get("applicationUrl"), "#"));
        scheme.setDeadline(text(data.get("deadline"), ""));
        scheme.setActive(!Boolean.FALSE.equals(data.get("active")));
        scheme.setUpdatedAt(LocalDateTime.now());
    }

    private List<String> stringList(Object value) {
        if (!(value instanceof List<?> items)) return List.of();
        return items.stream().map(Object::toString).toList();
    }

    private String requiredText(Map<String, Object> data, String key) {
        String result = text(data.get(key), "");
        if (result.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, key + " is required");
        }
        return result;
    }

    private String text(Object value, String fallback) {
        return value == null ? fallback : value.toString();
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
