package com.tony.service.tonywuai.dto;

import lombok.Data;

/**
 * AI 工具数据传输对象 (用于展示可用工具列表)
 */
@Data
public class AIToolDTO {

    /**
     * 工具ID
     */
    private Long id;

    /**
     * 工具名称
     */
    private String toolName;

    /**
     * 工具描述
     */
    private String description;

    /**
     * 后端API接口路径
     */
    private String apiPath;

    /**
     * 工具图标 URL
     */
    private String iconUrl;

    private Boolean isActive;

    private Integer type;

    private String vipAllow;

    private String linkType;
}
