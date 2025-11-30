package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ExamSessionCreateRequest {
    private Long userId;
    private String userName;
    @Size(max = 100)
    private String paperName;
    @Size(max = 20)
    private String subject;
    private Integer grade;
    private String questionIds;
    private String score;
    private Integer correctNum;
  private Integer wrongNum;
  private String answerDetailsJson;
  @Size(max = 2000)
  private String aiSummary;
  private String startTime;
  private String endTime;
  private Integer status;
  private String code;
}
