package com.tony.service.tonywuai.dto;

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
    public static class CommentCreateRequest {
        @NotNull(message = "文章ID不能为空")
        private Long articleId;

        @NotBlank(message = "评论内容不能为空")
        private String content;

        private Long parentId; // 可选，回复的评论ID
    }

    /**
     * 评论响应 DTO
     */
    @Data
    @Builder
    public static class CommentResponse {
        private Long id;
        private Long articleId;
        private Long userId; // 实际应用中会是用户的昵称/头像
        private String content;
        private Long parentId;
        private LocalDateTime createdAt;
        private Boolean isDeleted;
    }
}