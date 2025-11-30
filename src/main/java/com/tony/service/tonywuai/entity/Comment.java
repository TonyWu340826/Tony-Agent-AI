package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 数据库表 t_comment 对应的实体类
 * 文章评论信息
 */
@Data
@Entity
@Table(name = "t_comment")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 评论的文章ID */
    @Column(name = "article_id", nullable = false)
    private Long articleId;

    /** 发表评论的用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 评论内容 */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /** 父评论ID (用于回复) */
    @Column(name = "parent_id")
    private Long parentId;

    /** 是否删除 (软删除) */
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    /** 评论时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
    }
}