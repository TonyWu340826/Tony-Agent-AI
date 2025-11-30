package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

/**
 * AI工具更新请求数据传输对象
 * 用于接收客户端更新现有 AI 工具的请求数据。
 */
@Data
public class AIToolUpdateRequest {

    @NotBlank(message = "工具代码不能为空")
    @Size(max = 50, message = "工具代码长度不能超过 50 个字符")
    private String toolCode;

    @NotBlank(message = "工具名称不能为空")
    @Size(max = 100, message = "工具名称长度不能超过 100 个字符")
    private String toolName;

    @Size(max = 1000, message = "描述长度不能超过 1000 个字符")
    private String description;

    @NotBlank(message = "计费类型不能为空")
    private String billingType;

    @NotNull(message = "单次费用不能为空")
    @Min(value = 0, message = "单次费用不能为负")
    private BigDecimal costPerUse;

    @NotBlank(message = "状态不能为空")
    private String status;

    @NotNull(message = "排序权重不能为空")
    @Min(value = 0, message = "排序权重不能为负")
    private Integer sortOrder;

    @Size(max = 255, message = "图标URL长度不能超过 255 个字符")
    private String iconUrl;

    @Size(max = 100, message = "后端服务名称长度不能超过 100 个字符")
    private String backendService;
}