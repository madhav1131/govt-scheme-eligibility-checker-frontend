package in.gov.eligibility.repository;

import in.gov.eligibility.model.SchemeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepository extends JpaRepository<SchemeEntity, String> {
    List<SchemeEntity> findByActiveTrue();
}
