package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ExamQuestionCreateRequest {
    @NotBlank
    @Size(max = 20)
    private String subject;

    @NotNull
    private Integer grade;

    @NotBlank
    @Size(max = 20)
    private String type;

    @NotBlank
    @Size(max = 2000)
    private String content;

    @Size(max = 2000)
    private String optionsJson;

    @Size(max = 1000)
    private String correctAnswer;

  @Size(max = 2000)
  private String explanation;

  @Size(max = 500)
  private String knowledgeTags;

  private Integer num;
}
