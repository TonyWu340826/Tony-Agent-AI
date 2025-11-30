package com.tony.service.tonywuai.entity;
import com.tony.service.tonywuai.com.ArticleStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 数据库表 t_article 对应的实体类
 * 博客文章信息
 */
@Data
@Entity
@Table(name = "t_article")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 文章标题 */
    @Column(nullable = false, length = 255)
    private String title;

    /** 文章URL别名/链接标识 */
    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    /** 文章摘要 */
    @Column(length = 500)
    private String summary;

    /** 文章内容 (使用LONGTEXT) */
    /** 文章内容 (使用LONGTEXT) */
    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    /** 内容格式：PLAINTEXT / MARKDOWN / HTML */
    @Column(name = "content_format", nullable = false, length = 20)
    private String contentFormat = "PLAINTEXT";

    /** 文章类型（分类），如：TECH、NEWS、TUTORIAL 等 */
    @Column(name = "type", length = 50)
    private String type;

    /** 作者名称 */
    @Column(name = "author_name", nullable = false, length = 100)
    private String authorName = "Admin";

    /** 阅读次数 */
    @Column(nullable = false)
    private Integer views = 0;

    /** 文章状态：草稿/已发布 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleStatus status = ArticleStatus.DRAFT;

    /** 创建时间 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 最后更新时间 */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 在对象持久化前自动设置创建时间和更新时间
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.authorName == null) {
            this.authorName = "Admin";
        }
        if (this.contentFormat == null || this.contentFormat.isBlank()) {
            this.contentFormat = "PLAINTEXT";
        }
    }

    /**
     * 在对象更新前自动设置更新时间
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
