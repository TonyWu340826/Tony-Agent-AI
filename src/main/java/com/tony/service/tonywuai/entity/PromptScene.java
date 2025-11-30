package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "t_prompt_scene")
@EntityListeners(AuditingEntityListener.class)
public class PromptScene {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scene_code", nullable = false, unique = true, length = 50)
    private String sceneCode;

    @Column(name = "scene_name", nullable = false, length = 100)
    private String sceneName;

    @Column(name = "template_code", nullable = false, length = 50)
    private String templateCode; // 关联默认模板编码（来自 t_prompt_template.code）

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", nullable = false)
    private Integer status = 1; // 1启用，0停用

    @Column(name = "create_person", nullable = false, length = 20)
    private String createPerson = "system";

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
