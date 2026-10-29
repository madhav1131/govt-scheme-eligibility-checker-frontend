package in.gov.eligibility.controller;

import in.gov.eligibility.model.SchemeEntity;
import in.gov.eligibility.repository.SchemeRepository;
import in.gov.eligibility.service.EligibilityService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {
    private final SchemeRepository schemes;
    private final EligibilityService eligibilityService;

    public EligibilityController(SchemeRepository schemes, EligibilityService eligibilityService) {
        this.schemes = schemes;
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/check")
    public Map<String, Object> check(@RequestBody Map<String, Object> userDetails) {
        List<Map<String, Object>> results = schemes.findByActiveTrue().stream()
                .map(scheme -> result(userDetails, scheme))
                .sorted(Comparator.comparingInt(
                        result -> -((Number) result.get("matchPercentage")).intValue()))
                .toList();
        long eligible = results.stream().filter(result -> "Eligible".equals(result.get("status"))).count();
        long partiallyEligible = results.stream()
                .filter(result -> "Partially Eligible".equals(result.get("status"))).count();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalEvaluated", results.size());
        summary.put("fullyEligibleCount", eligible);
        summary.put("partiallyEligibleCount", partiallyEligible);
        summary.put("ineligibleCount", results.size() - eligible - partiallyEligible);
        summary.put("userProvidedDetails", userDetails);
        return Map.of("success", true, "summary", summary, "results", results);
    }

    private Map<String, Object> result(Map<String, Object> userDetails, SchemeEntity scheme) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("scheme", scheme);
        result.putAll(eligibilityService.evaluate(userDetails, scheme));
        return result;
    }
}
