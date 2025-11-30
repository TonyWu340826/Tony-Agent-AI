package com.tony.service.tonywuai.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ExamQuestionDTO {
    private Long id;
    private String subject;
    private Integer grade;
    private String type;
    private String content;
    private String optionsJson;
    private String correctAnswer;
  private String explanation;
  private String knowledgeTags;
  private Integer num;
  private Date createdAt;
  private Date updatedAt;
}
