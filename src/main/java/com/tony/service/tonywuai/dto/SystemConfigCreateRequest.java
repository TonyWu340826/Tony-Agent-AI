package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * SystemConfig 创建/更新请求 DTO
 * 用于接收客户端提交的配置数据
 */
@Data
@Schema(description = "系统配置创建/更新请求")
public class SystemConfigCreateRequest {

    @NotBlank(message = "Config key 不能为空")
    @Size(max = 100, message = "Config key 长度不能超过 100")
    @Schema(description = "配置键名", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 100)
    private String configKey;

    @Schema(description = "配置值")
    private String configValue;

    @Size(max = 512, message = "描述信息长度不能超过 512")
    @Schema(description = "配置描述", maxLength = 512)
    private String description;

    @NotBlank(message = "Config type 不能为空")
    @Schema(description = "配置类型", requiredMode = Schema.RequiredMode.REQUIRED)
    private String configType;
}
