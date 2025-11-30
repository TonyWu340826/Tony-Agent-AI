package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 文章创建请求 DTO
 */
@Data
public class ArticleCreateRequest {

    @NotBlank(message = "文章标题不能为空")
    private String title;

    @NotBlank(message = "文章 URL 别名不能为空")
    private String slug;

    private String summary;

    @NotBlank(message = "文章内容不能为空")
    private String content;

    private String status; // DRAFT 或 PUBLISHED

    private String authorName; // 可选，默认 Admin

    /** 内容格式：PLAINTEXT / MARKDOWN / HTML */
    private String contentFormat;

    /** 文章类型（分类） */
    private String type;
}
