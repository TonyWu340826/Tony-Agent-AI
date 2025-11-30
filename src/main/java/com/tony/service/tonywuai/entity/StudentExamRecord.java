package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@Entity
@Table(name = "t_student_exam_record")
@EntityListeners(AuditingEntityListener.class)
public class StudentExamRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(name = "grade", nullable = false)
    private Integer grade;

    @Column(name = "subject", nullable = false, length = 20)
    private String subject;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Date createdAt;
}

