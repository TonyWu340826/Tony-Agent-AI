package com.tony.service.tonywuai.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "t_category")
@Schema(description = "Category Entity")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier")
    private Long id;

    @Column(nullable = false, length = 100)
    @Schema(description = "Category Name", example = "Java")
    private String name;

    @Column(name = "description")
    @Schema(description = "Description of the category")
    private String description;

    @Column(name = "icon")
    @Schema(description = "Icon URL or identifier")
    private String icon;

    /** 父级分类ID，顶级为 null */
    @Column(name = "parent_id")
    @Schema(description = "Parent Category ID (null if root)")
    private Long parentId;

    /** 层级：1-顶级，2-二级，3-三级 */
    @Column(nullable = false)
    @Schema(description = "Hierarchy level (1: Root, 2: Second level, etc.)", example = "1")
    private Integer level = 1;

    /** 分类类型(1:文章类型,2:AI工具类型,3:VIP类型) */
    @Column(name = "type", nullable = false)
    @Schema(description = "Category Type (1: Article, 2: AI Tool, 3: VIP)", example = "1")
    private Integer type = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Schema(description = "Creation Timestamp")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.level == null) this.level = 1;
        if (this.type == null) this.type = 1;
    }
}
