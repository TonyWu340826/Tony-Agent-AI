package com.tony.service.tonywuai.service;

/**
 * 文章点赞业务服务接口
 */
public interface ArticleLikeService {

    /**
     * 切换文章点赞状态 (如果已点赞则取消，否则点赞)
     * @param articleId 文章ID
     * @param userId 当前用户ID
     * @return boolean true表示点赞成功/已点赞，false表示取消点赞
     * @throws RuntimeException 如果文章不存在
     */
    boolean toggleLike(Long articleId, Long userId);

    /**
     * 获取文章的点赞总数
     * @param articleId 文章ID
     * @return 点赞总数
     */
    long getLikeCount(Long articleId);

    /**
     * 检查当前用户是否点赞了某篇文章
     * @param articleId 文章ID
     * @param userId 当前用户ID
     * @return boolean true表示已点赞
     */
    boolean hasUserLikedArticle(Long articleId, Long userId);
}