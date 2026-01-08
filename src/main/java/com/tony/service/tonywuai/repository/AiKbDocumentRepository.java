package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.AiKbDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiKbDocumentRepository extends JpaRepository<AiKbDocument, Long> {
    List<AiKbDocument> findByUserIdAndOrgCodeOrderByCreatedAtDesc(String userId, String orgCode);

    Optional<AiKbDocument> findByIdAndUserId(Long id, String userId);
}
