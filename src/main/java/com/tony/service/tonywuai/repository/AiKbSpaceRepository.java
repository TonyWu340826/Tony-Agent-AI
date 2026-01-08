package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.AiKbSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AiKbSpaceRepository extends JpaRepository<AiKbSpace, Long> {
    List<AiKbSpace> findByUserIdOrderByUpdatedAtDesc(String userId);

    boolean existsByUserIdAndOrgCode(String userId, String orgCode);

    Optional<AiKbSpace> findByIdAndUserId(Long id, String userId);
}
