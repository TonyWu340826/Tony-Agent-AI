package com.tony.service.tonywuai.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * SystemConfig 数据传输对象 (DTO)
 * 用于向客户端展示完整的配置信息
 */
@Data
public class SystemConfigDto {
    private Long id;
    private String configKey;
    private String configValue;
    private String description;
    private String configType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}