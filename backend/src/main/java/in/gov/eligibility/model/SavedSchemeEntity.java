package in.gov.eligibility.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_schemes", uniqueConstraints =
        @UniqueConstraint(name = "uk_saved_scheme_user_scheme", columnNames = {"user_id", "scheme_id"}))
public class SavedSchemeEntity {
    @Id
    @Column(length = 36)
    private String id;
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;
    @Column(name = "scheme_id", nullable = false, length = 36)
    private String schemeId;
    @Column(nullable = false, length = 250)
    private String schemeTitle;
    @Column(length = 100)
    private String category;
    @Column(columnDefinition = "text")
    private String benefits;
    @Column(nullable = false)
    private LocalDateTime savedAt;

    protected SavedSchemeEntity() {
    }

    public SavedSchemeEntity(String userId, String schemeId, String schemeTitle, String category, String benefits) {
        this.id = java.util.UUID.randomUUID().toString();
        this.userId = userId;
        this.schemeId = schemeId;
        this.schemeTitle = schemeTitle;
        this.category = category;
        this.benefits = benefits;
        this.savedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getSchemeId() { return schemeId; }
    public String getSchemeTitle() { return schemeTitle; }
    public String getCategory() { return category; }
    public String getBenefits() { return benefits; }
    public LocalDateTime getSavedAt() { return savedAt; }
}
