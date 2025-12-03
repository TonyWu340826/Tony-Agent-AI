package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.entity.PromptScene;
import com.tony.service.tonywuai.entity.PromptTemplate;
import com.tony.service.tonywuai.service.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/prompt/admin")
@RequiredArgsConstructor
public class PromptAdminController {

    private final PromptService promptService;

    // 场景列表
    @GetMapping("/scenes")
    public ResponseEntity<Page<PromptScene>> listScenes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword
    ) {
        Page<PromptScene> scenes = promptService.listScenes(page, size, status, keyword);
        return ResponseEntity.ok(scenes);
    }

    @PostMapping("/scenes")
    public ResponseEntity<?> createScene(@RequestBody PromptScene scene) {
        try { return ResponseEntity.status(HttpStatus.CREATED).body(promptService.createScene(scene)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    @PutMapping("/scenes/{id}")
    public ResponseEntity<?> updateScene(@PathVariable Long id, @RequestBody PromptScene scene) {
        try { return ResponseEntity.ok(promptService.updateScene(id, scene)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    @DeleteMapping("/scenes/{id}")
    public ResponseEntity<?> deleteScene(@PathVariable Long id) {
        try { promptService.hardDeleteScene(id); return ResponseEntity.noContent().build(); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage())); }
    }

    // 模板列表
    @GetMapping("/templates")
    public ResponseEntity<Page<PromptTemplate>> listTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam Optional<String> scene_code,
            @RequestParam Optional<String> model_type,
            @RequestParam Optional<String> role_type,
            @RequestParam Optional<String> version,
            @RequestParam Optional<String> status,
            @RequestParam Optional<String> keyword
    ) {
        Map<String, String> filters = Map.of(
                "scene_code", scene_code.orElse(""),
                "model_type", model_type.orElse(""),
                "role_type", role_type.orElse(""),
                "version", version.orElse(""),
                "status", status.orElse("")
        );
        Page<PromptTemplate> pageData = promptService.listTemplates(page, size, filters, keyword.orElse(""));
        return ResponseEntity.ok(pageData);
    }

    @PostMapping("/templates")
    public ResponseEntity<?> createTemplate(@RequestBody Map<String, Object> body) {
        try {
            PromptTemplate t = new PromptTemplate();
            t.setSceneCode(str(body.get("scene_code")));
            t.setModelType(str(body.get("model_type")));
            t.setVersion(intOrDefault(body.get("version"), 1));
            t.setRoleType(str(body.get("role_type")));
            t.setTemplateName(str(body.get("template_name")));
            t.setTemplateContent(str(body.get("template_content")));
            t.setParamSchema(jsonString(body.get("param_schema")));
            t.setStatus(intOrDefault(body.get("status"), 0));
            t.setCreatePerson(str(body.get("create_person")) == null ? "system" : str(body.get("create_person")));
            return ResponseEntity.status(HttpStatus.CREATED).body(promptService.createTemplate(t));
        } catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    @PutMapping("/templates/{id}")
    public ResponseEntity<?> updateTemplate(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            PromptTemplate t = new PromptTemplate();
            t.setSceneCode(str(body.get("scene_code")));
            t.setModelType(str(body.get("model_type")));
            t.setVersion(intOrDefault(body.get("version"), 1));
            t.setRoleType(str(body.get("role_type")));
            t.setTemplateName(str(body.get("template_name")));
            t.setTemplateContent(str(body.get("template_content")));
            t.setParamSchema(jsonString(body.get("param_schema")));
            t.setStatus(intOrDefault(body.get("status"), 0));
            t.setCreatePerson(str(body.get("create_person")));
            return ResponseEntity.ok(promptService.updateTemplate(id, t));
        } catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage())); }
    }

    @DeleteMapping("/templates/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        try { promptService.hardDeleteTemplate(id); return ResponseEntity.noContent().build(); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage())); }
    }

    @PostMapping("/templates/{id}/copy")
    public ResponseEntity<?> copyTemplate(@PathVariable Long id) {
        try { return ResponseEntity.ok(promptService.copyTemplate(id)); }
        catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage())); }
    }

    @PostMapping("/templates/test")
    public ResponseEntity<?> testTemplate(@RequestBody Map<String, Object> body) {
        try {
            Long templateId = Long.valueOf(String.valueOf(body.get("templateId")));
            String modelType = body.get("model_type") != null ? String.valueOf(body.get("model_type")) : null;
            String roleType = body.get("role_type") != null ? String.valueOf(body.get("role_type")) : null;
            Map<String, Object> params = (Map<String, Object>) body.getOrDefault("params", Map.of());
            String output = promptService.testTemplate(templateId, modelType, roleType, params);
            return ResponseEntity.ok(Map.of("output", output));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private static String str(Object v) { return v == null ? null : String.valueOf(v); }
    private static Integer intOrDefault(Object v, int def) { try { return v == null ? def : Integer.valueOf(String.valueOf(v)); } catch (Exception e) { return def; } }

    private static String jsonString(Object v) {
        if (v == null) return null;
        if (v instanceof String) return (String) v;
        try { 
            return new ObjectMapper().writeValueAsString(v);
        } catch (Exception e) { 
            return null; 
        }
    }
}
