package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.dto.CommentCreateRequest;
import com.tony.service.tonywuai.dto.CommentDTO;
import com.tony.service.tonywuai.dto.UserDTO;
import com.tony.service.tonywuai.entity.Comment;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.repository.CommentRepository;
import com.tony.service.tonywuai.service.CommentService;
import com.tony.service.tonywuai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 评论业务服务实现类
 */
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserService userService;

    /**
     * 辅助方法：将 User 实体转换为 UserDTO
     */
    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        dto.setVipLevel(user.getVipLevel());
        dto.setBalance(user.getBalance());
        dto.setRegistrationDate(user.getRegistrationDate());
        return dto;
    }

    /**
     * 递归构建评论树
     */
    private List<CommentDTO> buildCommentTree(Long articleId, List<Comment> comments, Map<Long, User> userCache) {
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = new CommentDTO();
                    dto.setId(comment.getId());
                    dto.setArticleId(comment.getArticleId());
                    dto.setContent(comment.getContent());
                    dto.setParentId(comment.getParentId());
                    dto.setCreatedAt(comment.getCreatedAt());

                    // 设置评论者信息
                    User author = userCache.get(comment.getUserId());
                    if (author != null) {
                        dto.setAuthor(convertUserToDTO(author));
                    } else {
                        // 如果用户不存在，使用默认的“已注销用户”
                        UserDTO deletedUser = new UserDTO();
                        deletedUser.setNickname("已注销用户");
                        dto.setAuthor(deletedUser);
                    }

                    // 递归查找回复
                    List<Comment> replies = commentRepository.findAllByArticleIdAndParentIdAndIsDeletedFalseOrderByCreatedAtAsc(articleId, comment.getId());
                    if (!replies.isEmpty()) {
                        dto.setReplies(buildCommentTree(articleId, replies, userCache));
                    } else {
                        dto.setReplies(Collections.emptyList());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * 获取文章评论 (树状结构)
     */
    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByArticleId(Long articleId) {
        if (!articleRepository.existsById(articleId)) {
            throw new RuntimeException("文章ID不存在: " + articleId);
        }

        // 1. 获取所有顶级评论
        List<Comment> topLevelComments = commentRepository.findAllByArticleIdAndParentIdIsNullAndIsDeletedFalseOrderByCreatedAtAsc(articleId);

        if (topLevelComments.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. 收集所有相关的用户ID (这里只收集顶级评论的用户ID，但理想情况下应该收集所有层级的用户ID以优化性能)
        List<Long> allUserIds = topLevelComments.stream()
                .map(Comment::getUserId)
                .collect(Collectors.toList());

        // 3. 批量查询用户信息
        List<User> users = userService.getAllUsersByIds(allUserIds);
        Map<Long, User> userCache = users.stream().collect(Collectors.toMap(User::getId, user -> user));

        // 4. 构建评论树
        return buildCommentTree(articleId, topLevelComments, userCache);
    }

    /**
     * 创建新评论
     */
    @Override
    @Transactional
    public Comment createComment(CommentCreateRequest request, Long userId) {
        // 1. 验证文章是否存在
        if (!articleRepository.existsById(request.getArticleId())) {
            throw new RuntimeException("评论的文章ID不存在: " + request.getArticleId());
        }

        // 2. 验证父评论是否存在 (如果是回复)
        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("回复的父评论ID不存在: " + request.getParentId()));

            if (parent.getIsDeleted()) {
                throw new RuntimeException("父评论已被删除，无法回复");
            }
        }

        // 3. 创建评论实体
        Comment comment = new Comment();
        comment.setArticleId(request.getArticleId());
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        comment.setParentId(request.getParentId());

        return commentRepository.save(comment);
    }

    /**
     * 删除评论
     */
    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("评论ID不存在: " + commentId));

        // 仅评论者本人可以删除 (后续可扩展管理员权限)
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("您没有权限删除此评论");
        }

        // 软删除
        comment.setIsDeleted(true);
        commentRepository.save(comment);
    }
}