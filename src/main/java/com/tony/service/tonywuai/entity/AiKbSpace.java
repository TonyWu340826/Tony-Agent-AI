package com.tony.service.tonywuai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "ai_kb_space")
public class AiKbSpace extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "org_code", nullable = false, length = 64)
    private String orgCode;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "description", length = 512)
    private String description;
}
