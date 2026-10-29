package in.gov.eligibility.service;

import in.gov.eligibility.model.SchemeEntity;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class EligibilityService {
    public Map<String, Object> evaluate(Map<String, Object> user, SchemeEntity scheme) {
        Map<String, Object> criteria = scheme.getEligibilityCriteria() == null
                ? Map.of() : scheme.getEligibilityCriteria();
        int totalScore = 0;
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        int age = number(user.get("age"), 0);
        int minAge = number(criteria.get("minAge"), 0);
        int maxAge = number(criteria.get("maxAge"), 100);
        if (age >= minAge && age <= maxAge) {
            totalScore += 20;
            passed.add("Age (" + age + " years) satisfies requirement (" + minAge + "-" + maxAge + " years)");
        } else {
            failed.add("Age (" + age + " years) outside required range (" + minAge + "-" + maxAge + " years)");
        }

        int income = number(user.get("income"), 0);
        int maxIncome = number(criteria.get("maxIncome"), 0);
        if (maxIncome == 0 || income <= maxIncome) {
            totalScore += 25;
            passed.add(maxIncome == 0 ? "No maximum income restriction"
                    : "Annual income (₹" + format(income) + ") is within limit (₹" + format(maxIncome) + ")");
        } else {
            failed.add("Annual income (₹" + format(income) + ") exceeds ceiling of ₹" + format(maxIncome));
        }

        String gender = text(user.get("gender"), "All");
        String requiredGender = text(criteria.get("gender"), "All");
        if (requiredGender.equalsIgnoreCase("All") || requiredGender.equalsIgnoreCase(gender)) {
            totalScore += 15;
            passed.add("Gender requirement (" + requiredGender + ") matches");
        } else {
            failed.add("Scheme reserved for " + requiredGender + " applicants");
        }

        String category = text(user.get("category"), "General");
        List<String> categories = stringList(criteria.get("categories"), List.of("All"));
        if (categories.contains("All") || categories.contains(category)) {
            totalScore += 15;
            passed.add("Category (" + category + ") eligible");
        } else {
            failed.add("Category (" + category + ") not eligible (Requires: " + String.join(", ", categories) + ")");
        }

        String occupation = text(user.get("occupation"), "All");
        List<String> occupations = stringList(criteria.get("occupations"), List.of("All"));
        if (occupations.contains("All") || occupations.contains(occupation)) {
            totalScore += 15;
            passed.add("Occupation (" + occupation + ") matches target group");
        } else {
            failed.add("Occupation (" + occupation + ") does not match target (" + String.join(", ", occupations) + ")");
        }

        boolean bonusMatched = true;
        if (Boolean.TRUE.equals(criteria.get("studentOnly")) && !Boolean.TRUE.equals(user.get("isStudent"))) {
            bonusMatched = false;
            failed.add("Requires active student status");
        }
        if (Boolean.TRUE.equals(criteria.get("disabilityOnly")) && !Boolean.TRUE.equals(user.get("isDisability"))) {
            bonusMatched = false;
            failed.add("Requires Person with Disability (PwD) status");
        }
        if (bonusMatched) {
            totalScore += 10;
            if (Boolean.TRUE.equals(criteria.get("studentOnly"))) passed.add("Student status verified");
            if (Boolean.TRUE.equals(criteria.get("disabilityOnly"))) passed.add("Disability status verified");
        }

        int percentage = Math.round(totalScore * 100.0f / 100);
        String status = percentage >= 80 ? "Eligible" : percentage >= 50 ? "Partially Eligible" : "Ineligible";
        return Map.of(
                "matchPercentage", percentage,
                "status", status,
                "passedCriteria", passed,
                "failedCriteria", failed,
                "isEligible", "Eligible".equals(status));
    }

    private int number(Object value, int fallback) {
        if (value == null || value.toString().isBlank()) return fallback;
        try {
            return (int) Math.round(Double.parseDouble(value.toString()));
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("Expected a numeric profile or scheme value");
        }
    }

    private String text(Object value, String fallback) {
        return value == null || value.toString().isBlank() ? fallback : value.toString();
    }

    private List<String> stringList(Object value, List<String> fallback) {
        if (!(value instanceof List<?> items) || items.isEmpty()) return fallback;
        return items.stream().map(Object::toString).toList();
    }

    private String format(int amount) {
        return NumberFormat.getNumberInstance(new Locale("en", "IN")).format(amount);
    }
}
