package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * AI 工具数据传输对象 (用于展示可用工具列表)
 */
@Data
@Schema(description = "AI工具数据传输对象")
public class AIToolDTO {

    @Schema(description = "工具ID")
    private Long id;

    @Schema(description = "工具名称")
    private String toolName;

    @Schema(description = "工具描述")
    private String description;

    @Schema(description = "后端API接口路径")
    private String apiPath;

    @Schema(description = "工具图标URL")
    private String iconUrl;

    @Schema(description = "是否激活")
    private Boolean isActive;

    @Schema(description = "工具类型")
    private Integer type;

    @Schema(description = "VIP权限要求")
    private String vipAllow;

    @Schema(description = "链接类型")
    private String linkType;
}
