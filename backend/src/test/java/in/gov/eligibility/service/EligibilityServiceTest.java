package in.gov.eligibility.service;

import in.gov.eligibility.model.SchemeEntity;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EligibilityServiceTest {
    private final EligibilityService service = new EligibilityService();

    @Test
    void awardsFullScoreWhenProfileMeetsEveryCriterion() {
        SchemeEntity scheme = new SchemeEntity();
        scheme.setEligibilityCriteria(Map.of(
                "minAge", 18,
                "maxAge", 40,
                "maxIncome", 200000,
                "gender", "All",
                "categories", List.of("OBC"),
                "occupations", List.of("Student"),
                "studentOnly", true,
                "disabilityOnly", false));
        Map<String, Object> user = Map.of(
                "age", 24,
                "income", 180000,
                "gender", "Male",
                "category", "OBC",
                "occupation", "Student",
                "isStudent", true,
                "isDisability", false);

        Map<String, Object> result = service.evaluate(user, scheme);

        assertEquals(100, result.get("matchPercentage"));
        assertEquals("Eligible", result.get("status"));
        assertEquals(true, result.get("isEligible"));
    }

    @Test
    void awardsPartialScoreWhenStudentRequirementIsNotMet() {
        SchemeEntity scheme = new SchemeEntity();
        scheme.setEligibilityCriteria(Map.of(
                "minAge", 18,
                "maxAge", 40,
                "maxIncome", 0,
                "gender", "All",
                "categories", List.of("All"),
                "occupations", List.of("All"),
                "studentOnly", true,
                "disabilityOnly", false));
        Map<String, Object> user = Map.of("age", 24, "income", 180000,
                "gender", "Male", "category", "OBC", "occupation", "Student");

        Map<String, Object> result = service.evaluate(user, scheme);

        assertEquals(90, result.get("matchPercentage"));
        assertEquals("Eligible", result.get("status"));
    }
}
