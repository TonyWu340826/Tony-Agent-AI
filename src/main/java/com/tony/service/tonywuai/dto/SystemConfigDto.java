package com.tony.service.tonywuai.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * SystemConfig 数据传输对象 (DTO)
 * 用于向客户端展示完整的配置信息
 */
@Data
@Schema(description = "系统配置数据传输对象")
public class SystemConfigDto {
    @Schema(description = "配置ID")
    private Long id;
    
    @Schema(description = "配置键名")
    private String configKey;
    
    @Schema(description = "配置值")
    private String configValue;
    
    @Schema(description = "配置描述")
    private String description;
    
    @Schema(description = "配置类型")
    private String configType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间", pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间", pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
