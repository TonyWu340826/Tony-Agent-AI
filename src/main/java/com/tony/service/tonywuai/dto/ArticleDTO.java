package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章数据传输对象 (用于前后端数据交互)
 */
@Data
@Schema(description = "文章数据传输对象")
public class ArticleDTO {

    @Schema(description = "文章ID")
    private Long id;

    @Schema(description = "文章标题")
    private String title;

    @Schema(description = "文章URL别名/链接标识")
    private String slug;

    @Schema(description = "文章摘要")
    private String summary;

    @Schema(description = "文章内容")
    private String content;

    @Schema(description = "作者名称")
    private String authorName;

    @Schema(description = "阅读次数")
    private Integer views;

    @Schema(description = "发布时间")
    private LocalDateTime createdAt;

    @Schema(description = "文章状态(DRAFT/PUBLISHED)")
    private String status;

    @Schema(description = "内容格式:PLAINTEXT/MARKDOWN/HTML")
    private String contentFormat;

    @Schema(description = "文章类型(分类)")
    private String type;
}
