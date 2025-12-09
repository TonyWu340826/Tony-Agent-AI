package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 创建/更新 AI 工具的请求数据传输对象 (DTO)
 */
@Data
@Schema(description = "创建/更新 AI 工具请求")
public class AIToolCreateRequest {

    @NotBlank(message = "工具名称不能为空")
    @Size(max = 100, message = "工具名称不能超过100个字符")
    @Schema(description = "工具名称", example = "ChatGPT 4.0")
    private String toolName;

    @Size(max = 500, message = "工具描述不能超过500个字符")
    @Schema(description = "工具描述", example = "最强大的AI对话模型")
    private String description;

    @NotBlank(message = "API 路径不能为空")
    @Size(max = 255, message = "API 路径不能超过255个字符")
    @Schema(description = "API 路径", example = "/api/chat/gpt4")
    private String apiPath;

    @Size(max = 255, message = "图标 URL 不能超过255个字符")
    @Schema(description = "图标 URL", example = "https://example.com/icon.png")
    private String iconUrl;

    /**
     * 默认激活，但允许通过请求设置
     */
    @Schema(description = "是否激活", defaultValue = "true")
    private Boolean isActive = true;

    @Schema(description = "工具类型", example = "1")
    private Integer type = 1;

    @Schema(description = "VIP 权限要求", example = "NO")
    private String vipAllow = "NO";
}
