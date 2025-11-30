package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.ArticleCreateRequest;
import com.tony.service.tonywuai.dto.ArticleDTO;
import com.tony.service.tonywuai.dto.ArticleUpdateRequest;
import com.tony.service.tonywuai.entity.Article;
import org.springframework.data.domain.Page;

/**
 * 文章业务服务接口
 */
public interface ArticleService {

    /**
     * 获取已发布的文章分页列表
     * @param page 页码 (从 0 开始)
     * @param size 每页大小
     * @return ArticleDTO 分页结果
     */
    Page<ArticleDTO> getPublishedArticles(int page, int size);

    /**
     * 根据 slug 获取已发布的文章详情
     * @param slug 文章 URL 别名
     * @return ArticleDTO 详情
     * @throws RuntimeException 如果文章未找到或未发布
     */
    ArticleDTO getPublishedArticleDetail(String slug);

    /**
     * (管理员操作) 创建新文章
     * @param request 创建请求 DTO
     * @return 创建的文章实体
     */
    Article createArticle(ArticleCreateRequest request);

    /**
     * (管理员操作) 更新文章
     * @param id 文章ID
     * @param request 更新请求 DTO
     * @return 更新后的文章实体
     * @throws RuntimeException 如果文章未找到
     */
    Article updateArticle(Long id, ArticleUpdateRequest request);

    /**
     * (管理员操作) 删除文章
     * @param id 文章ID
     * @throws RuntimeException 如果文章未找到
     */
    void deleteArticle(Long id);
}