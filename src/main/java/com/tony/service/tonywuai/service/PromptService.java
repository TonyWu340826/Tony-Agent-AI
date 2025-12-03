package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.entity.PromptScene;
import com.tony.service.tonywuai.entity.PromptTemplate;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PromptService {
    Page<PromptTemplate> listTemplates(int page, int size, Map<String, String> filters, String keyword);
    PromptTemplate createTemplate(PromptTemplate template);
    PromptTemplate updateTemplate(Long id, PromptTemplate template);
    void softDeleteTemplate(Long id);
    void hardDeleteTemplate(Long id);
    PromptTemplate copyTemplate(Long id);
    String testTemplate(Long templateId, String modelType, String roleType, Map<String, Object> params);

    Page<PromptScene> listScenes(int page, int size, Integer status, String keyword);
    PromptScene createScene(PromptScene scene);
    PromptScene updateScene(Long id, PromptScene scene);
    void softDeleteScene(Long id);
    void hardDeleteScene(Long id);
}

