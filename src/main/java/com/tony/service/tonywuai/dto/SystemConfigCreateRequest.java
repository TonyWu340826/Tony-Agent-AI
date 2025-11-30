package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * SystemConfig 创建/更新请求 DTO
 * 用于接收客户端提交的配置数据
 */
@Data
public class SystemConfigCreateRequest {

    @NotBlank(message = "Config key 不能为空")
    @Size(max = 100, message = "Config key 长度不能超过 100")
    private String configKey;

    // configValue 使用 String 接收，实际类型根据 configType 转换
    private String configValue;

    @Size(max = 512, message = "描述信息长度不能超过 512")
    private String description;

    @NotBlank(message = "Config type 不能为空")
    private String configType;
}