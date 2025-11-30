package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 系统配置实体 (SystemConfig)
 * 用于存储系统级别的键值对配置，例如默认值、API密钥等。
 */
@Entity
@Table(name = "t_system_config")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class SystemConfig {

    /** 唯一主键ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 配置键 (Key)
     * 必须唯一，例如: "DEFAULT_COST", "CACHE_TTL_SECONDS"
     */
    @Column(name = "config_key", nullable = false, unique = true, length = 100)
    private String configKey;

    /**
     * 配置值 (Value)
     * 存储配置的实际值。
     */
    @Lob
    @Column(name = "config_value", columnDefinition = "longtext")
    private String configValue;

    /**
     * 配置描述
     * 用于解释配置的作用。
     */
    @Column(name = "description", length = 512)
    private String description;

    /**
     * 配置类型：TEXT(文本), NUMBER(数字), JSON(JSON对象), BOOLEAN(布尔值)
     * 用于在前端界面进行适当的展示和校验。
     */
    @Column(name = "config_type", length = 20)
    private String configType;

    /** 记录创建时间 */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 记录最后更新时间 */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
