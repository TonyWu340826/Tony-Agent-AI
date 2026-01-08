package com.tony.service.tonywuai.openapi.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "文档检索对话请求")
public class DocChatRequest {

    @JsonAlias({"message", "message"})
    @Schema(description = "用户问题/输入内容（第三方接口字段为 texts；本项目兼容 message）", example = "文章大意")
    private String message;

    @Schema(description = "模型名称", example = "text-embedding-v4")
    private String model;

    @Schema(description = "文档类型（用于标量过滤，可选）", example = "1")
    private String docType;

    @Schema(description = "组织编码（用于标量过滤，可选）", example = "10000")
    private String orgCode;
}
