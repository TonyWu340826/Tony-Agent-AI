package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 创建/更新 AI 工具的请求数据传输对象 (DTO)
 */
@Data
public class AIToolCreateRequest {

    @NotBlank(message = "工具名称不能为空")
    @Size(max = 100, message = "工具名称不能超过100个字符")
    private String toolName;

    @Size(max = 500, message = "工具描述不能超过500个字符")
    private String description;

    @NotBlank(message = "API 路径不能为空")
    @Size(max = 255, message = "API 路径不能超过255个字符")
    private String apiPath;

    @Size(max = 255, message = "图标 URL 不能超过255个字符")
    private String iconUrl;

    /**
     * 默认激活，但允许通过请求设置
     */
    private Boolean isActive = true;

    private Integer type = 1;

    private String vipAllow = "NO";
}
