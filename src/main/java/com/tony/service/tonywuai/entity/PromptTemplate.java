package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "t_prompt_template",
       uniqueConstraints = {
               @UniqueConstraint(name = "uniq_scene_model_version_role", columnNames = {"scene_code","model_type","version","role_type"})
       })
@EntityListeners(AuditingEntityListener.class)
public class PromptTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, length = 50)
    private String code; // TT+timestamp

    @Column(name = "scene_code", nullable = true, length = 50)
    private String sceneCode;

    @Column(name = "model_type", nullable = false, length = 50)
    private String modelType;

    @Column(name = "version", nullable = false)
    private Integer version = 1;

    @Column(name = "role_type", nullable = false, length = 20)
    private String roleType; // system/user/assistant

    @Column(name = "template_name", length = 100)
    private String templateName;

    @Lob
    @Column(name = "template_content", nullable = false, columnDefinition = "LONGTEXT")
    private String templateContent;

    @Lob
    @Column(name = "param_schema", columnDefinition = "LONGTEXT")
    private String paramSchema; // JSON string

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
