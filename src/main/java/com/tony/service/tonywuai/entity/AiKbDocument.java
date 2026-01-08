package com.tony.service.tonywuai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "ai_kb_document")
public class AiKbDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private AiKbSpace space;

    @Column(name = "user_id", nullable = false, length = 64)
    private String userId;

    @Column(name = "org_code", nullable = false, length = 64)
    private String orgCode;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "doc_type", nullable = false, length = 16)
    private String docType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 128)
    private String mimeType;

    @Column(name = "storage_path", length = 512)
    private String storagePath;

    @Column(name = "checksum", length = 128)
    private String checksum;

    @Column(name = "status", nullable = false, length = 32)
    private String status;

    @Column(name = "process_json", columnDefinition = "json")
    private String processJson;

    @Column(name = "error_message", columnDefinition = "text")
    private String errorMessage;
}
