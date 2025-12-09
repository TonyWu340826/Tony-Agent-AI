package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论数据传输对象
 */
@Data
@Schema(description = "评论数据传输对象")
public class CommentDTO {

    @Schema(description = "评论ID")
    private Long id;

    @Schema(description = "评论的文章ID")
    private Long articleId;

    @Schema(description = "评论内容")
    private String content;

    @Schema(description = "评论者信息")
    private UserDTO author;

    @Schema(description = "父评论ID(如果存在)")
    private Long parentId;

    @Schema(description = "评论时间")
    private LocalDateTime createdAt;

    @Schema(description = "子评论列表(用于嵌套显示)")
    private List<CommentDTO> replies;
}
