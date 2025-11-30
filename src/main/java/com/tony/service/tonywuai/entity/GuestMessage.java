package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "t_guest_message")
@EntityListeners(AuditingEntityListener.class)
@Data
public class GuestMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // 可为空，匿名留言

    @Column(name = "nickname", length = 128)
    private String nickname;

    @Column(name = "email", length = 256)
    private String email;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Lob
    @Column(name = "reply", columnDefinition = "TEXT")
    private String reply;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
}

