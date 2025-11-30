package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.entity.SystemConfig;

import java.util.List;

/**
 * 系统配置服务接口 (SystemConfigService)
 */
public interface SystemConfigService {

    /**
     * 获取所有系统配置
     * @return 所有的 SystemConfig 列表
     */
    List<SystemConfig> findAll();

    /**
     * 根据ID获取单个配置
     * @param id 配置ID
     * @return SystemConfig 实体
     * @throws Exception 如果找不到对应ID的配置
     */
    SystemConfig findById(Long id) throws Exception;

    /**
     * 根据配置键 (Key) 获取配置
     * @param configKey 配置键
     * @return SystemConfig 实体
     * @throws Exception 如果找不到对应Key的配置
     */
    SystemConfig findByKey(String configKey) throws Exception;

    /**
     * 保存或更新配置
     * @param config 要保存的 SystemConfig 实体
     * @return 已保存的 SystemConfig 实体
     */
    SystemConfig save(SystemConfig config);

    /**
     * 删除指定ID的配置
     * @param id 配置ID
     */
    void deleteById(Long id);

    /**
     * 核心方法：根据配置键获取配置值 (String类型)
     * 这是应用层最常用的方法，用于快速获取配置值。
     * @param configKey 配置键
     * @param defaultValue 如果找不到配置时返回的默认值
     * @return 配置值，如果不存在则返回默认值
     */
    String getConfigValue(String configKey, String defaultValue);

    /**
     * 核心方法：根据配置键获取配置值 (Integer类型)
     * @param configKey 配置键
     * @param defaultValue 如果找不到配置或值格式错误时返回的默认值
     * @return 配置值，如果不存在或格式错误则返回默认值
     */
    Integer getConfigValueAsInt(String configKey, Integer defaultValue);

    /**
     * 核心方法：根据配置键获取配置值 (Boolean类型)
     * @param configKey 配置键
     * @param defaultValue 如果找不到配置或值格式错误时返回的默认值
     * @return 配置值，如果不存在或格式错误则返回默认值
     */
    Boolean getConfigValueAsBoolean(String configKey, Boolean defaultValue);
}