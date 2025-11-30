package com.tony.service.tonywuai.service;
import com.tony.service.tonywuai.dto.CommentCreateRequest;
import com.tony.service.tonywuai.dto.CommentDTO;
import com.tony.service.tonywuai.entity.Comment;

import java.util.List;

/**
 * 评论业务服务接口
 */
public interface CommentService {

    /**
     * 根据文章ID获取所有评论 (以树状结构返回)
     * @param articleId 文章ID
     * @return 评论DTO列表 (顶级评论包含子回复)
     */
    List<CommentDTO> getCommentsByArticleId(Long articleId);

    /**
     * 创建新评论或回复
     * @param request 评论创建请求 DTO
     * @param userId 当前用户ID
     * @return 创建的评论实体
     */
    Comment createComment(CommentCreateRequest request, Long userId);

    /**
     * 删除评论 (仅限评论者本人或管理员)
     * @param commentId 评论ID
     * @param userId 当前用户ID
     * @throws RuntimeException 如果评论不存在或无权删除
     */
    void deleteComment(Long commentId, Long userId);
}