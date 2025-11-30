package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.PromptTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromptTemplateRepository extends JpaRepository<PromptTemplate, Long> {
    List<PromptTemplate> findBySceneCode(String sceneCode);
    List<PromptTemplate> findBySceneCodeAndModelType(String sceneCode, String modelType);
}

