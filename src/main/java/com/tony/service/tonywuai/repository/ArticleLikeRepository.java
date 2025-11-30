package com.tony.service.tonywuai.repository;
import com.tony.service.tonywuai.entity.ArticleLike;
import com.tony.service.tonywuai.entity.ArticleLikePK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

/**
 * t_article_like 表的数据访问层接口
 */
@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLike, ArticleLikePK> {

    /**
     * 统计某一文章的点赞总数
     * @param articleId 文章ID
     * @return 点赞总数
     */
    long countByArticleId(Long articleId);

    /**
     * 检查特定用户是否点赞了某篇文章
     * @param articleId 文章ID
     * @param userId 用户ID
     * @return Optional<ArticleLike>
     */
    Optional<ArticleLike> findByArticleIdAndUserId(Long articleId, Long userId);

    /**
     * 根据文章ID和用户ID删除点赞记录
     * @param articleId 文章ID
     * @param userId 用户ID
     */
    @Transactional
    void deleteByArticleIdAndUserId(Long articleId, Long userId);

    /**
     * 获取某文章的所有点赞记录
     */
    java.util.List<ArticleLike> findAllByArticleIdOrderByCreatedAtDesc(Long articleId);
}
