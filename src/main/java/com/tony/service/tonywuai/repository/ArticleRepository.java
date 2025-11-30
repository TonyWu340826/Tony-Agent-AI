package com.tony.service.tonywuai.repository;
import com.tony.service.tonywuai.com.ArticleStatus;
import com.tony.service.tonywuai.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * t_article 表的数据访问层接口
 */
@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    /**
     * 根据 URL 别名和状态查找文章
     * @param slug URL 别名
     * @param status 文章状态
     * @return 匹配的文章
     */
    Optional<Article> findBySlugAndStatus(String slug, ArticleStatus status);

    /**
     * 查找所有已发布的文章，并进行分页
     * @param status 文章状态 (必须是 PUBLISHED)
     * @param pageable 分页信息
     * @return 文章分页列表
     */
    Page<Article> findAllByStatusOrderByCreatedAtDesc(ArticleStatus status, Pageable pageable);
}