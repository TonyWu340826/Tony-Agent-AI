package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.entity.PromptScene;
import com.tony.service.tonywuai.entity.PromptTemplate;
import com.tony.service.tonywuai.openapi.PythonOpenApiClient;
import com.tony.service.tonywuai.repository.PromptSceneRepository;
import com.tony.service.tonywuai.repository.PromptTemplateRepository;
import com.tony.service.tonywuai.service.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromptServiceImpl implements PromptService {

    private final PromptTemplateRepository templateRepo;
    private final PromptSceneRepository sceneRepo;
    private final PythonOpenApiClient pythonClient;

    @Override
    public Page<PromptTemplate> listTemplates(int page, int size, Map<String, String> filters, String keyword) {
        List<PromptTemplate> all = templateRepo.findAll();
        String scene = filters.getOrDefault("scene_code", "");
        String model = filters.getOrDefault("model_type", "");
        String role = filters.getOrDefault("role_type", "");
        String versionStr = filters.getOrDefault("version", "");
        String statusStr = filters.getOrDefault("status", "");

        Integer version = null; try { if (!versionStr.isBlank()) version = Integer.valueOf(versionStr); } catch (Exception ignore) { }
        Integer status = null; try { if (!statusStr.isBlank()) status = Integer.valueOf(statusStr); } catch (Exception ignore) { }

        Integer finalVersion = version;
        Integer finalStatus = status;
        List<PromptTemplate> filtered = all.stream().filter(t -> {
            if (!scene.isBlank() && !scene.equalsIgnoreCase(t.getSceneCode())) return false;
            if (!model.isBlank() && !model.equalsIgnoreCase(t.getModelType())) return false;
            if (!role.isBlank() && !role.equalsIgnoreCase(t.getRoleType())) return false;
            if (finalVersion != null && !Objects.equals(finalVersion, t.getVersion())) return false;
            if (finalStatus != null && !Objects.equals(finalStatus, t.getStatus())) return false;
            if (keyword != null && !keyword.isBlank()) {
                String k = keyword.toLowerCase();
                String nm = Optional.ofNullable(t.getTemplateName()).orElse("");
                String ct = Optional.ofNullable(t.getTemplateContent()).orElse("");
                if (!(nm.toLowerCase().contains(k) || ct.toLowerCase().contains(k))) return false;
            }
            return true;
        }).sorted(Comparator.comparing(PromptTemplate::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed()).collect(Collectors.toList());

        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        return new PageImpl<>(filtered.subList(start, end), PageRequest.of(Math.max(0, page), size), filtered.size());
    }

    @Override
    @Transactional
    public PromptTemplate createTemplate(PromptTemplate template) {
        if (template.getCode() == null || template.getCode().isBlank()) {
            template.setCode(genCode());
        }
        // 如果未提供 sceneCode，表示未关联场景，保持为空
        if (template.getTemplateContent() == null) {
            template.setTemplateContent("");
        }
        if (template.getParamSchema() == null) {
            template.setParamSchema("[]");
        }
        return templateRepo.save(template);
    }

    @Override
    @Transactional
    public PromptTemplate updateTemplate(Long id, PromptTemplate template) {
        PromptTemplate db = templateRepo.findById(id).orElseThrow(() -> new RuntimeException("模板不存在:" + id));
        if (template.getCode() != null && !template.getCode().isBlank()) {
            db.setCode(template.getCode());
        }
        db.setSceneCode(template.getSceneCode());
        db.setModelType(template.getModelType());
        db.setVersion(Optional.ofNullable(template.getVersion()).orElse(1));
        db.setRoleType(template.getRoleType());
        db.setTemplateName(template.getTemplateName());
        db.setTemplateContent(Optional.ofNullable(template.getTemplateContent()).orElse(db.getTemplateContent()==null?"":db.getTemplateContent()));
        db.setParamSchema(Optional.ofNullable(template.getParamSchema()).orElse(db.getParamSchema()==null?"[]":db.getParamSchema()));
        db.setStatus(Optional.ofNullable(template.getStatus()).orElse(0));
        db.setCreatePerson(Optional.ofNullable(template.getCreatePerson()).orElse(db.getCreatePerson()));
        return templateRepo.save(db);
    }

    @Override
    @Transactional
    public void softDeleteTemplate(Long id) {
        PromptTemplate db = templateRepo.findById(id).orElseThrow(() -> new RuntimeException("模板不存在:" + id));
        db.setStatus(1); // 1 表示删除
        templateRepo.save(db);
    }

    @Override
    @Transactional
    public void hardDeleteTemplate(Long id) {
        PromptTemplate db = templateRepo.findById(id).orElseThrow(() -> new RuntimeException("模板不存在:" + id));
        templateRepo.deleteById(db.getId());
    }

    @Override
    @Transactional
    public PromptTemplate copyTemplate(Long id) {
        PromptTemplate src = templateRepo.findById(id).orElseThrow(() -> new RuntimeException("模板不存在:" + id));
        PromptTemplate copy = new PromptTemplate();
        copy.setCode(genCode());
        copy.setSceneCode(src.getSceneCode());
        copy.setModelType(src.getModelType());
        copy.setVersion(Optional.ofNullable(src.getVersion()).orElse(1) + 1);
        copy.setRoleType(src.getRoleType());
        copy.setTemplateName(src.getTemplateName());
        copy.setTemplateContent(src.getTemplateContent());
        copy.setParamSchema(src.getParamSchema());
        copy.setStatus(0);
        copy.setCreatePerson(src.getCreatePerson());
        return templateRepo.save(copy);
    }

    @Override
    public String testTemplate(Long templateId, String modelType, String roleType, Map<String, Object> params) {
        PromptTemplate t = templateRepo.findById(templateId).orElseThrow(() -> new RuntimeException("模板不存在:" + templateId));
        String prompt = render(t.getTemplateContent(), params);
        String prefix = (roleType != null && !roleType.isBlank()) ? ("[角色:" + roleType + "]\n") : "";
        if (modelType != null && !modelType.isBlank()) {
            prefix = prefix + "[模型:" + modelType + "]\n";
        }
        String finalPrompt = prefix + prompt;
        String output = pythonClient.chat(finalPrompt);
        return Optional.ofNullable(output).orElse("");
    }

    @Override
    public Page<PromptScene> listScenes(int page, int size, Integer status, String keyword) {
        List<PromptScene> all = sceneRepo.findAll();
        List<PromptScene> filtered = all.stream().filter(s -> {
            if (status != null && !Objects.equals(status, s.getStatus())) return false;
            if (keyword != null && !keyword.isBlank()) {
                String k = keyword.toLowerCase();
                String name = Optional.ofNullable(s.getSceneName()).orElse("");
                String code = Optional.ofNullable(s.getSceneCode()).orElse("");
                String desc = Optional.ofNullable(s.getDescription()).orElse("");
                if (!(name.toLowerCase().contains(k) || code.toLowerCase().contains(k) || desc.toLowerCase().contains(k))) return false;
            }
            return true;
        }).sorted(Comparator.comparing(PromptScene::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed()).collect(Collectors.toList());
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        return new PageImpl<>(filtered.subList(start, end), PageRequest.of(Math.max(0, page), size), filtered.size());
    }

    @Override
    @Transactional
    public PromptScene createScene(PromptScene scene) {
        if (scene.getSceneCode() == null || scene.getSceneCode().isBlank()) {
            scene.setSceneCode(genSceneCode());
        }
        if (scene.getTemplateCode() == null || scene.getTemplateCode().isBlank()) {
            scene.setTemplateCode("UNLINKED");
        }
        return sceneRepo.save(scene);
    }

    @Override
    @Transactional
    public PromptScene updateScene(Long id, PromptScene scene) {
        PromptScene db = sceneRepo.findById(id).orElseThrow(() -> new RuntimeException("场景不存在:" + id));
        if (scene.getSceneCode() != null && !scene.getSceneCode().isBlank()) {
            db.setSceneCode(scene.getSceneCode());
        }
        db.setSceneName(scene.getSceneName());
        if (scene.getTemplateCode() != null && !scene.getTemplateCode().isBlank()) {
            db.setTemplateCode(scene.getTemplateCode());
        }
        db.setDescription(scene.getDescription());
        db.setStatus(Optional.ofNullable(scene.getStatus()).orElse(1));
        db.setCreatePerson(Optional.ofNullable(scene.getCreatePerson()).orElse(db.getCreatePerson()));
        return sceneRepo.save(db);
    }

    @Override
    @Transactional
    public void softDeleteScene(Long id) {
        PromptScene db = sceneRepo.findById(id).orElseThrow(() -> new RuntimeException("场景不存在:" + id));
        db.setStatus(0);
        sceneRepo.save(db);
    }

    @Override
    @Transactional
    public void hardDeleteScene(Long id) {
        PromptScene db = sceneRepo.findById(id).orElseThrow(() -> new RuntimeException("场景不存在:" + id));
        sceneRepo.deleteById(db.getId());
    }

    private String genCode() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        return "TT" + ts;
    }
    private String genSceneCode() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        return "BY" + ts;
    }

    private static final Pattern VAR_PATTERN = Pattern.compile("\\{\\{\\s*([a-zA-Z0-9_.-]+)\\s*\\}}|\\{\\s*([a-zA-Z0-9_.-]+)\\s*\\}");

    private String render(String template, Map<String, Object> params) {
        if (template == null) return "";
        if (params == null || params.isEmpty()) return template;
        Matcher m = VAR_PATTERN.matcher(template);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String key = m.group(1) != null ? m.group(1) : m.group(2);
            Object val = params.get(key);
            String rep = val == null ? "" : String.valueOf(val);
            m.appendReplacement(sb, Matcher.quoteReplacement(rep));
        }
        m.appendTail(sb);
        return sb.toString();
    }
}
