package com.tony.service.tonywuai.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 文章数据传输对象 (用于前后端数据交互)
 */
@Data
public class ArticleDTO {

    /**
     * 文章ID
     */
    private Long id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章URL别名/链接标识
     */
    private String slug;

    /**
     * 文章摘要
     */
    private String summary;

    /**
     * 文章内容 (在列表页可能不需要，但在详情页需要)
     */
    private String content;

    /**
     * 作者名称
     */
    private String authorName;

    /**
     * 阅读次数
     */
    private Integer views;

    /**
     * 发布时间
     */
    private LocalDateTime createdAt;

    /**
     * 文章状态（DRAFT / PUBLISHED）
     */
    private String status;

    /**
     * 内容格式：PLAINTEXT / MARKDOWN / HTML
     */
    private String contentFormat;

    /**
     * 文章类型（分类）
     */
    private String type;
}
