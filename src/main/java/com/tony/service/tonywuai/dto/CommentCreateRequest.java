package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 评论创建请求 DTO
 */
@Data
public class CommentCreateRequest {

    /** 评论的文章ID */
    @NotNull(message = "文章ID不能为空")
    private Long articleId;

    /** 评论内容 */
    @NotBlank(message = "评论内容不能为空")
    private String content;

    /** 父评论ID (如果是回复) */
    private Long parentId;
}