package com.tony.service.tonywuai.service.impl;
import com.tony.service.tonywuai.com.ArticleStatus;
import com.tony.service.tonywuai.dto.ArticleCreateRequest;
import com.tony.service.tonywuai.dto.ArticleDTO;
import com.tony.service.tonywuai.dto.ArticleUpdateRequest;
import com.tony.service.tonywuai.entity.Article;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 文章业务服务实现类
 */
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    /**
     * 将 Article 实体转换为 ArticleDTO
     */
    private ArticleDTO convertToDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setSlug(article.getSlug());
        dto.setSummary(article.getSummary());
        // 列表页不需要内容，详情页需要，这里为了简化，全部包含
        dto.setContent(article.getContent());
        dto.setAuthorName(article.getAuthorName());
        dto.setViews(article.getViews());
        dto.setCreatedAt(article.getCreatedAt());
        dto.setStatus(article.getStatus() != null ? article.getStatus().name() : null);
        dto.setContentFormat(article.getContentFormat());
        dto.setType(article.getType());
        return dto;
    }

    /**
     * 获取已发布的文章分页列表
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ArticleDTO> getPublishedArticles(int page, int size) {
        // 确保页码不小于 0
        Pageable pageable = PageRequest.of(Math.max(0, page), size);

        Page<Article> articles = articleRepository.findAllByStatusOrderByCreatedAtDesc(
                ArticleStatus.PUBLISHED,
                pageable
        );

        return articles.map(this::convertToDTO);
    }

    /**
     * 根据 slug 获取已发布的文章详情
     */
    @Override
    @Transactional
    public ArticleDTO getPublishedArticleDetail(String slug) {
        Article article = articleRepository.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED)
                .orElseThrow(() -> new RuntimeException("文章未找到或未发布: " + slug));

        // 增加阅读次数
        article.setViews(article.getViews() + 1);
        // 保存更新（由 @Transactional 自动同步到数据库）

        return convertToDTO(article);
    }

    /**
     * 创建新文章 (管理员操作)
     */
    @Override
    @Transactional
    public Article createArticle(ArticleCreateRequest request) {
        // 检查 slug 是否已存在
        if (articleRepository.findBySlugAndStatus(request.getSlug(), ArticleStatus.DRAFT).isPresent() ||
                articleRepository.findBySlugAndStatus(request.getSlug(), ArticleStatus.PUBLISHED).isPresent()) {
            throw new RuntimeException("文章别名(slug)已存在: " + request.getSlug());
        }

        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setSlug(request.getSlug());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        // 内容格式与类型
        String fmt = request.getContentFormat();
        article.setContentFormat((fmt == null || fmt.isBlank()) ? "PLAINTEXT" : fmt.toUpperCase());
        article.setType(request.getType());
        // 状态：默认 DRAFT，当传入为空时
        String statusStr = request.getStatus();
        ArticleStatus statusEnum = ArticleStatus.DRAFT;
        if (statusStr != null && !statusStr.isBlank()) {
            statusEnum = ArticleStatus.valueOf(statusStr.toUpperCase());
        }
        article.setStatus(statusEnum);
        if (request.getAuthorName() != null) {
            article.setAuthorName(request.getAuthorName());
        }

        return articleRepository.save(article);
    }

    /**
     * 更新文章 (管理员操作)
     */
    @Override
    @Transactional
    public Article updateArticle(Long id, ArticleUpdateRequest request) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("文章ID不存在: " + id));

        // 检查 slug 是否被其他文章占用
        Optional<Article> articleWithSameSlug = articleRepository.findBySlugAndStatus(
                request.getSlug(), ArticleStatus.PUBLISHED);

        if (articleWithSameSlug.isPresent() && !articleWithSameSlug.get().getId().equals(id)) {
            throw new RuntimeException("文章别名(slug)已被其他文章占用: " + request.getSlug());
        }

        existingArticle.setTitle(request.getTitle());
        existingArticle.setSlug(request.getSlug());
        existingArticle.setSummary(request.getSummary());
        existingArticle.setContent(request.getContent());
        String fmt = request.getContentFormat();
        if (fmt != null && !fmt.isBlank()) {
            existingArticle.setContentFormat(fmt.toUpperCase());
        }
        if (request.getType() != null) {
            existingArticle.setType(request.getType());
        }
        String statusStr = request.getStatus();
        if (statusStr != null && !statusStr.isBlank()) {
            existingArticle.setStatus(ArticleStatus.valueOf(statusStr.toUpperCase()));
        }
        
        return articleRepository.save(existingArticle);
    }

    /**
     * 删除文章 (管理员操作)
     */
    @Override
    @Transactional
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new RuntimeException("文章ID不存在: " + id);
        }
        articleRepository.deleteById(id);
    }
}
