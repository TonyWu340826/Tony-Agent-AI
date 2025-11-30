package com.tony.service.tonywuai.service.impl;
import com.tony.service.tonywuai.entity.ArticleLike;
import com.tony.service.tonywuai.repository.ArticleLikeRepository;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.service.ArticleLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 文章点赞业务服务实现类
 */
@Service
@RequiredArgsConstructor
public class ArticleLikeServiceImpl implements ArticleLikeService {

    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleRepository articleRepository;

    /**
     * 切换文章点赞状态
     */
    @Override
    @Transactional
    public boolean toggleLike(Long articleId, Long userId) {
        if (!articleRepository.existsById(articleId)) {
            throw new RuntimeException("文章ID不存在: " + articleId);
        }

        Optional<ArticleLike> existingLike = articleLikeRepository.findByArticleIdAndUserId(articleId, userId);

        if (existingLike.isPresent()) {
            // 如果已点赞，则取消点赞
            articleLikeRepository.deleteByArticleIdAndUserId(articleId, userId);
            return false; // 取消点赞
        } else {
            // 如果未点赞，则创建点赞记录
            ArticleLike newLike = new ArticleLike();
            newLike.setArticleId(articleId);
            newLike.setUserId(userId);
            articleLikeRepository.save(newLike);
            return true; // 点赞成功
        }
    }

    /**
     * 获取文章的点赞总数
     */
    @Override
    @Transactional(readOnly = true)
    public long getLikeCount(Long articleId) {
        return articleLikeRepository.countByArticleId(articleId);
    }

    /**
     * 检查当前用户是否点赞了某篇文章
     */
    @Override
    @Transactional(readOnly = true)
    public boolean hasUserLikedArticle(Long articleId, Long userId) {
        return articleLikeRepository.findByArticleIdAndUserId(articleId, userId).isPresent();
    }
}