package com.tony.service.tonywuai.entity;

import com.tony.service.tonywuai.entity.ArticleLikePK;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 数据库表 t_article_like 对应的实体类
 * 文章点赞记录
 */
@Data
@Entity
@Table(name = "t_article_like")
@IdClass(ArticleLikePK.class) // 使用联合主键
public class ArticleLike {

    /** 被点赞的文章ID */
    @Id
    @Column(name = "article_id", nullable = false)
    private Long articleId;

    /** 点赞的用户ID */
    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 点赞时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}