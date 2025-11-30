package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.entity.SystemConfig;
import com.tony.service.tonywuai.repository.SystemConfigRepository;
import com.tony.service.tonywuai.service.SystemConfigService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * SystemConfig 服务接口实现
 */
@Service
@Slf4j
public class SystemConfigServiceImpl implements SystemConfigService {

    private final SystemConfigRepository configRepository;

    public SystemConfigServiceImpl(SystemConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    /**
     * 获取所有系统配置
     */
    @Override
    public List<SystemConfig> findAll() {
        return configRepository.findAll();
    }

    /**
     * 根据ID获取单个配置
     */
    @Override
    public SystemConfig findById(Long id) throws Exception {
        return configRepository.findById(id)
                .orElseThrow(() -> new Exception("ID"));
    }

    /**
     * 根据配置键 (Key) 获取配置
     */
    @Override
    public SystemConfig findByKey(String configKey) throws Exception {
        return configRepository.findByConfigKey(configKey)
                .orElseThrow(() -> new Exception("SystemConfig"));
    }

    /**
     * 保存或更新配置
     */
    @Override
    @Transactional
    public SystemConfig save(SystemConfig config) {
        // 确保 configKey 存在，并且如果ID为空，则尝试通过configKey查找，避免重复插入
        if (config.getId() == null && config.getConfigKey() != null) {
            configRepository.findByConfigKey(config.getConfigKey()).ifPresent(existingConfig -> {
                // 如果已存在，则使用已存在的ID进行更新
                config.setId(existingConfig.getId());
                log.warn("SystemConfig with key {} already exists. Proceeding with update.", config.getConfigKey());
            });
        }
        return configRepository.save(config);
    }

    /**
     * 删除指定ID的配置
     */
    @Override
    public void deleteById(Long id) {
        configRepository.deleteById(id);
    }

    // --- 核心配置值获取方法 ---

    /**
     * 根据配置键获取配置值 (String类型)
     */
    @Override
    public String getConfigValue(String configKey, String defaultValue) {
        return configRepository.findByConfigKey(configKey)
                .map(SystemConfig::getConfigValue)
                .orElseGet(() -> {
                    log.debug("Config key {} not found, using default value: {}", configKey, defaultValue);
                    return defaultValue;
                });
    }

    /**
     * 根据配置键获取配置值 (Integer类型)
     */
    @Override
    public Integer getConfigValueAsInt(String configKey, Integer defaultValue) {
        String value = getConfigValue(configKey, null);
        if (value == null) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            log.error("Failed to parse config value '{}' for key {} as Integer. Using default value {}.", value, configKey, defaultValue, e);
            return defaultValue;
        }
    }

    /**
     * 根据配置键获取配置值 (Boolean类型)
     */
    @Override
    public Boolean getConfigValueAsBoolean(String configKey, Boolean defaultValue) {
        String value = getConfigValue(configKey, null);
        if (value == null) {
            return defaultValue;
        }
        // 匹配 "true", "True", "TRUE", "1" 为 true
        return "true".equalsIgnoreCase(value.trim()) || "1".equals(value.trim());
    }
}