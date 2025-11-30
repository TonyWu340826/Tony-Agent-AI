package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.PromptScene;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromptSceneRepository extends JpaRepository<PromptScene, Long> {
    Optional<PromptScene> findBySceneCode(String sceneCode);
    List<PromptScene> findByStatus(Integer status);
}

