package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@Entity
@Table(name = "t_exam_question")
@EntityListeners(AuditingEntityListener.class)
public class ExamQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject", nullable = false, length = 20)
    private String subject; // 数学/语文/英语

    @Column(name = "grade", nullable = false)
    private Integer grade; // 1-6

    @Column(name = "q_type", nullable = false, length = 20)
    private String type; // 选择/判断/填空/简答

    @Column(name = "content", nullable = false, length = 2000)
    private String content; // 题目内容

    @Column(name = "options_json", length = 2000)
    private String optionsJson; // 选择题选项JSON，其他题型可为空

    @Column(name = "correct_answer", length = 1000)
    private String correctAnswer; // 正确答案

    @Column(name = "explanation", length = 2000)
    private String explanation; // 解析

    @Column(name = "knowledge_tags", length = 500)
    private String knowledgeTags; // 逗号分隔的标签

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "num")
    private Integer num;

}

