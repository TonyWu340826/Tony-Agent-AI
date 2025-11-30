package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "t_exam_session")
@EntityListeners(AuditingEntityListener.class)
public class ExamSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", length = 20)
    private String userName;

    @Column(name = "paper_name", length = 100)
    private String paperName;

    @Column(name = "subject", length = 20)
    private String subject;

    @Column(name = "grade")
    private Integer grade;

    @Column(name = "question_ids", columnDefinition = "text")
    private String questionIds;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "correct_num")
    private Integer correctNum = 0;

    @Column(name = "wrong_num")
    private Integer wrongNum = 0;

  @Column(name = "answer_details_json", columnDefinition = "json")
  private String answerDetailsJson;

  @Column(name = "ai_summary", length = 2000)
  private String aiSummary;

  @Column(name = "status")
  private Integer status = 0;

  @Column(name = "code", length = 20)
  private String code;

    @Column(name = "start_time")
    private Date startTime;

    @Column(name = "end_time")
    private Date endTime;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Date createdAt;
}
