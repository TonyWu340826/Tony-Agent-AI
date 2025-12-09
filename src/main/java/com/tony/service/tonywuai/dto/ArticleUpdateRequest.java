package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 文章更新请求 DTO
 */
@Data
@Schema(description = "文章更新请求")
public class ArticleUpdateRequest {

    @NotBlank(message = "文章标题不能为空")
    @Schema(description = "文章标题", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @NotBlank(message = "文章 URL 别名不能为空")
    @Schema(description = "文章URL别名", requiredMode = Schema.RequiredMode.REQUIRED)
    private String slug;

    @Schema(description = "文章摘要")
    private String summary;

    @NotBlank(message = "文章内容不能为空")
    @Schema(description = "文章内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "文章状态:DRAFT或PUBLISHED")
    private String status;

    @Schema(description = "内容格式:PLAINTEXT/MARKDOWN/HTML")
    private String contentFormat;

    @Schema(description = "文章类型(分类)")
    private String type;
}
