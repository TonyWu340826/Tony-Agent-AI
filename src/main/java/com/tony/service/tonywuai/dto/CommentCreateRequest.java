package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 评论创建请求 DTO
 */
@Data
@Schema(description = "评论创建请求")
public class CommentCreateRequest {

    @NotNull(message = "文章ID不能为空")
    @Schema(description = "评论的文章ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long articleId;

    @NotBlank(message = "评论内容不能为空")
    @Schema(description = "评论内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "父评论ID(如果是回复)")
    private Long parentId;
}
