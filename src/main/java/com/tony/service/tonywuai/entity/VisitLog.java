package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "t_visit_log")
@EntityListeners(AuditingEntityListener.class)
@Data
public class VisitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", length = 128)
    private String username;

    @Column(name = "ip", length = 64, nullable = false)
    private String ip;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "path", length = 255)
    private String path;

    @Column(name = "referrer", length = 255)
    private String referrer;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @Column(name = "visit_day")
    private Date visitDay;

    @PrePersist
    public void ensureTimestamps() {
        if (createdAt == null) {
            createdAt = new Date();
        }
        if (visitDay == null) {
            try {
                visitDay = new java.sql.Date(createdAt.getTime());
            } catch (Exception e) {
                visitDay = java.sql.Date.valueOf(LocalDate.now());
            }
        }
    }
}
