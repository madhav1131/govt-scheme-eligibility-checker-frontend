package in.gov.eligibility.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "schemes")
public class SchemeEntity {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 250)
    private String title;
    private String titleHi;
    @Column(nullable = false, length = 100)
    private String category;
    @Column(nullable = false, length = 200)
    private String ministry;
    @Column(nullable = false, columnDefinition = "text")
    private String description;
    @Column(columnDefinition = "text")
    private String descriptionHi;
    @Column(nullable = false, columnDefinition = "text")
    private String benefits;
    @Column(length = 100)
    private String benefitAmount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "json")
    private Map<String, Object> eligibilityCriteria;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "json")
    private List<String> documentsRequired;

    @Column(length = 1000)
    private String applicationUrl;
    @Column(length = 100)
    private String deadline;
    @Column(nullable = false)
    private boolean active;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public SchemeEntity() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTitleHi() { return titleHi; }
    public void setTitleHi(String titleHi) { this.titleHi = titleHi; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getMinistry() { return ministry; }
    public void setMinistry(String ministry) { this.ministry = ministry; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDescriptionHi() { return descriptionHi; }
    public void setDescriptionHi(String descriptionHi) { this.descriptionHi = descriptionHi; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public String getBenefitAmount() { return benefitAmount; }
    public void setBenefitAmount(String benefitAmount) { this.benefitAmount = benefitAmount; }
    public Map<String, Object> getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(Map<String, Object> eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }
    public List<String> getDocumentsRequired() { return documentsRequired; }
    public void setDocumentsRequired(List<String> documentsRequired) { this.documentsRequired = documentsRequired; }
    public String getApplicationUrl() { return applicationUrl; }
    public void setApplicationUrl(String applicationUrl) { this.applicationUrl = applicationUrl; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
