package com.tony.service.tonywuai.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class ExamSessionDTO {
  private Long id;
  private Long userId;
  private String userName;
  private String paperName;
    private String subject;
    private Integer grade;
    private String questionIds;
    private BigDecimal score;
    private Integer correctNum;
    private Integer wrongNum;
    private String answerDetailsJson;
  private String aiSummary;
  private Date startTime;
  private Date endTime;
  private Date createdAt;
  private Integer status;
  private String code;
}
