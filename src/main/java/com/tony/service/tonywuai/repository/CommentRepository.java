package com.tony.service.tonywuai.repository;
import com.tony.service.tonywuai.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * t_comment 表的数据访问层接口
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * 根据文章ID和父评论ID查找所有未删除的顶级评论
     * @param articleId 文章ID
     * @return 顶级评论列表
     */
    List<Comment> findAllByArticleIdAndParentIdIsNullAndIsDeletedFalseOrderByCreatedAtAsc(Long articleId);

    /**
     * 根据文章ID和父评论ID查找所有未删除的回复
     * @param articleId 文章ID
     * @param parentId 父评论ID
     * @return 评论列表
     */
    List<Comment> findAllByArticleIdAndParentIdAndIsDeletedFalseOrderByCreatedAtAsc(Long articleId, Long parentId);

    /**
     * 统计文章的评论总数 (未删除的)
     * @param articleId 文章ID
     * @return 评论总数
     */
    long countByArticleIdAndIsDeletedFalse(Long articleId);
}