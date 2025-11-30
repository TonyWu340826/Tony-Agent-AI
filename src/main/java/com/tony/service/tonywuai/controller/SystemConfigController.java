package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.SystemConfigCreateRequest;
import com.tony.service.tonywuai.dto.SystemConfigDto;
import com.tony.service.tonywuai.entity.SystemConfig;
import com.tony.service.tonywuai.service.SystemConfigService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 系统配置管理 RESTful API 接口
 * 路径: /api/v1/configs
 */
@RestController
@RequestMapping("/api/v1/configs")
@Slf4j
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    public SystemConfigController(SystemConfigService systemConfigService) {
        this.systemConfigService = systemConfigService;
    }

    // --- 辅助转换方法 (手动实现 DTO <-> Entity 转换) ---

    private SystemConfigDto convertToDto(SystemConfig entity) {
        if (entity == null) return null;
        SystemConfigDto dto = new SystemConfigDto();
        dto.setId(entity.getId());
        dto.setConfigKey(entity.getConfigKey());
        dto.setConfigValue(entity.getConfigValue());
        dto.setDescription(entity.getDescription());
        dto.setConfigType(entity.getConfigType());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private SystemConfig convertToEntity(SystemConfigCreateRequest request) {
        if (request == null) return null;
        SystemConfig entity = new SystemConfig();
        entity.setConfigKey(request.getConfigKey());
        entity.setConfigValue(request.getConfigValue());
        entity.setDescription(request.getDescription());
        entity.setConfigType(request.getConfigType());
        // ID 和审计字段会在保存时自动处理或忽略
        return entity;
    }


    // --- RESTful API 接口实现 ---

    /**
     * GET /api/v1/configs : 获取所有系统配置
     */
    @GetMapping
    public ResponseEntity<List<SystemConfigDto>> getAllConfigs() {
        log.info("Fetching all system configurations.");
        List<SystemConfig> configs = systemConfigService.findAll();
        List<SystemConfigDto> dtos = configs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * GET /api/v1/configs/{id} : 根据 ID 获取单个配置
     */
    @GetMapping("/{id}")
    public ResponseEntity<SystemConfigDto> getConfigById(@PathVariable Long id) throws Exception {
        log.info("Fetching system configuration by ID: {}", id);
        SystemConfig config = systemConfigService.findById(id);
        return ResponseEntity.ok(convertToDto(config));
    }

    /**
     * POST /api/v1/configs : 创建新的系统配置
     */
    @PostMapping
    public ResponseEntity<SystemConfigDto> createConfig(@Valid @RequestBody SystemConfigCreateRequest request) {
        log.info("Creating new system configuration with key: {}", request.getConfigKey());

        // 1. DTO 转换为 Entity
        SystemConfig configToSave = convertToEntity(request);

        // 2. 调用 Service 保存
        SystemConfig savedConfig = systemConfigService.save(configToSave);

        // 3. Entity 转换为 DTO 返回
        return new ResponseEntity<>(convertToDto(savedConfig), HttpStatus.CREATED);
    }

    /**
     * PUT /api/v1/configs/{id} : 更新现有配置
     */
    @PutMapping("/{id}")
    public ResponseEntity<SystemConfigDto> updateConfig(
            @PathVariable Long id,
            @Valid @RequestBody SystemConfigCreateRequest request) throws Exception {

        log.info("Updating system configuration ID: {}", id);

        // 1. 查找现有配置
        SystemConfig existingConfig = systemConfigService.findById(id);

        // 2. 更新字段
        existingConfig.setConfigKey(request.getConfigKey());
        existingConfig.setConfigValue(request.getConfigValue());
        existingConfig.setDescription(request.getDescription());
        existingConfig.setConfigType(request.getConfigType());
        // ID 保持不变

        // 3. 调用 Service 保存（执行更新）
        SystemConfig updatedConfig = systemConfigService.save(existingConfig);

        // 4. Entity 转换为 DTO 返回
        return ResponseEntity.ok(convertToDto(updatedConfig));
    }

    /**
     * DELETE /api/v1/configs/{id} : 删除指定 ID 的配置
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConfig(@PathVariable Long id) {
        log.warn("Deleting system configuration ID: {}", id);
        systemConfigService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/configs/value : 快速获取配置值（供内部服务调用）
     * 示例: /api/v1/configs/value?key=MAX_RETRIES&default=5
     */
    @GetMapping("/value")
    public ResponseEntity<String> getConfigValue(
            @RequestParam("key") String configKey,
            @RequestParam(value = "default", required = false, defaultValue = "") String defaultValue) {

        log.debug("Quickly fetching config value for key: {}", configKey);
        String value = systemConfigService.getConfigValue(configKey, defaultValue);
        return ResponseEntity.ok(value);
    }
}