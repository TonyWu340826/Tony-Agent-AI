package com.tony.service.tonywuai.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论数据传输对象
 */
@Data
public class CommentDTO {

    /**
     * 评论ID
     */
    private Long id;

    /**
     * 评论的文章ID
     */
    private Long articleId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 评论者信息
     */
    private UserDTO author;

    /**
     * 父评论ID (如果存在)
     */
    private Long parentId;

    /**
     * 评论时间
     */
    private LocalDateTime createdAt;

    /**
     * 子评论列表 (用于嵌套显示)
     */
    private List<CommentDTO> replies;

    // 可以在这里添加点赞数等统计信息
}