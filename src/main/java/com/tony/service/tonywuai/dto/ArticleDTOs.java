package com.tony.service.tonywuai.dto;

import com.tony.service.tonywuai.com.ArticleStatus;
import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "文章创建/更新请求")
    public static class ArticleCreateUpdateRequest {
        @NotBlank(message = "标题不能为空")
        @Size(max = 255, message = "标题长度不能超过 255")
        @Schema(description = "文章标题", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 255)
        private String title;

        @NotBlank(message = "Slug 不能为空")
        @Size(max = 255, message = "Slug 长度不能超过 255")
        @Schema(description = "文章URL别名", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 255)
        private String slug;

        @Size(max = 500, message = "摘要长度不能超过 500")
        @Schema(description = "文章摘要", maxLength = 500)
        private String summary;

        @NotBlank(message = "内容不能为空")
        @Schema(description = "文章内容", requiredMode = Schema.RequiredMode.REQUIRED)
        private String content;

        @NotNull(message = "状态不能为空")
        @Schema(description = "文章状态", requiredMode = Schema.RequiredMode.REQUIRED)
        private ArticleStatus status;
    }

    /**
     * 文章列表/摘要响应 DTO
     */
    @Data
    @Builder
    @Schema(description = "文章摘要响应")
    public static class ArticleSummaryResponse {
        @Schema(description = "文章ID")
        private Long id;
        
        @Schema(description = "文章标题")
        private String title;
        
        @Schema(description = "文章URL别名")
        private String slug;
        
        @Schema(description = "文章摘要")
        private String summary;
        
        @Schema(description = "作者名称")
        private String authorName;
        
        @Schema(description = "阅读次数")
        private Integer views;
        
        @Schema(description = "创建时间")
        private LocalDateTime createdAt;
        
        @Schema(description = "更新时间")
        private LocalDateTime updatedAt;
    }

    /**
     * 完整文章详情响应 DTO
     */
    @Data
    @Builder
    @Schema(description = "文章详情响应")
    public static class ArticleDetailResponse {
        @Schema(description = "文章ID")
        private Long id;
        
        @Schema(description = "文章标题")
        private String title;
        
        @Schema(description = "文章URL别名")
        private String slug;
        
        @Schema(description = "文章摘要")
        private String summary;
        
        @Schema(description = "文章内容")
        private String content;
        
        @Schema(description = "作者名称")
        private String authorName;
        
        @Schema(description = "阅读次数")
        private Integer views;
        
        @Schema(description = "文章状态")
        private ArticleStatus status;
        
        @Schema(description = "创建时间")
        private LocalDateTime createdAt;
        
        @Schema(description = "更新时间")
        private LocalDateTime updatedAt;
    }
}
