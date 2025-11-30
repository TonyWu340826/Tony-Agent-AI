package com.tony.service.tonywuai.dto;

import com.tony.service.tonywuai.com.ArticleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 文章相关的 DTOs
 */
public class ArticleDTOs {

    /**
     * 文章创建/更新请求 DTO
     */
    @Data
    public static class ArticleCreateUpdateRequest {
        @NotBlank(message = "标题不能为空")
        @Size(max = 255, message = "标题长度不能超过 255")
        private String title;

        @NotBlank(message = "Slug 不能为空")
        @Size(max = 255, message = "Slug 长度不能超过 255")
        private String slug;

        @Size(max = 500, message = "摘要长度不能超过 500")
        private String summary;

        @NotBlank(message = "内容不能为空")
        private String content;

        @NotNull(message = "状态不能为空")
        private ArticleStatus status;
    }

    /**
     * 文章列表/摘要响应 DTO
     */
    @Data
    @Builder
    public static class ArticleSummaryResponse {
        private Long id;
        private String title;
        private String slug;
        private String summary;
        private String authorName;
        private Integer views;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    /**
     * 完整文章详情响应 DTO
     */
    @Data
    @Builder
    public static class ArticleDetailResponse {
        private Long id;
        private String title;
        private String slug;
        private String summary;
        private String content;
        private String authorName;
        private Integer views;
        private ArticleStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}