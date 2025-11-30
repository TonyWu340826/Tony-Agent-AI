package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * SystemConfig Repository
 * 提供对系统配置表的基本 CRUD 操作，并支持通过 configKey 查询。
 */
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {

    /**
     * 根据配置键查找配置记录。
     * @param configKey 配置键
     * @return 包含 SystemConfig 实体的 Optional
     */
    Optional<SystemConfig> findByConfigKey(String configKey);
}