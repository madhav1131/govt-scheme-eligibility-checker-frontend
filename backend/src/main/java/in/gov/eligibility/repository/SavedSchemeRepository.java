package in.gov.eligibility.repository;

import in.gov.eligibility.model.SavedSchemeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedSchemeRepository extends JpaRepository<SavedSchemeEntity, String> {
    List<SavedSchemeEntity> findByUserId(String userId);
    Optional<SavedSchemeEntity> findByUserIdAndSchemeId(String userId, String schemeId);
}
