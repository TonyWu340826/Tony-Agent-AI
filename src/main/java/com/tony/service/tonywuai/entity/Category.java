package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "t_category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "icon")
    private String icon;

    /** 父级分类ID，顶级为 null */
    @Column(name = "parent_id")
    private Long parentId;

    /** 层级：1-顶级，2-二级，3-三级 */
    @Column(nullable = false)
    private Integer level = 1;

    /** 分类类型(1:文章类型,2:AI工具类型,3:VIP类型) */
    @Column(name = "type", nullable = false)
    private Integer type = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.level == null) this.level = 1;
        if (this.type == null) this.type = 1;
    }
}
