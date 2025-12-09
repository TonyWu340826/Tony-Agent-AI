package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 评论相关的 DTOs
 */
public class CommentDTOs {

    /**
     * 评论创建请求 DTO
     */
    @Data
    @Schema(description = "评论创建请求")
    public static class CommentCreateRequest {
        @NotNull(message = "文章ID不能为空")
        @Schema(description = "文章ID", requiredMode = Schema.RequiredMode.REQUIRED)
        private Long articleId;

        @NotBlank(message = "评论内容不能为空")
        @Schema(description = "评论内容", requiredMode = Schema.RequiredMode.REQUIRED)
        private String content;

        @Schema(description = "回复的评论ID(可选)")
        private Long parentId;
    }

    /**
     * 评论响应 DTO
     */
    @Data
    @Builder
    @Schema(description = "评论响应")
    public static class CommentResponse {
        @Schema(description = "评论ID")
        private Long id;
        
        @Schema(description = "文章ID")
        private Long articleId;
        
        @Schema(description = "用户ID")
        private Long userId;
        
        @Schema(description = "评论内容")
        private String content;
        
        @Schema(description = "父评论ID")
        private Long parentId;
        
        @Schema(description = "创建时间")
        private LocalDateTime createdAt;
        
        @Schema(description = "是否已删除")
        private Boolean isDeleted;
    }
}
