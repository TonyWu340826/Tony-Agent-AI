package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "试题创建请求")
public class ExamQuestionCreateRequest {
    @NotBlank
    @Size(max = 20)
    @Schema(description = "科目", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 20)
    private String subject;

    @NotNull
    @Schema(description = "年级", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer grade;

    @NotBlank
    @Size(max = 20)
    @Schema(description = "题目类型", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 20)
    private String type;

    @NotBlank
    @Size(max = 2000)
    @Schema(description = "题目内容", requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 2000)
    private String content;

    @Size(max = 2000)
    @Schema(description = "选项JSON", maxLength = 2000)
    private String optionsJson;

    @Size(max = 1000)
    @Schema(description = "正确答案", maxLength = 1000)
    private String correctAnswer;

    @Size(max = 2000)
    @Schema(description = "答案解析", maxLength = 2000)
    private String explanation;

    @Size(max = 500)
    @Schema(description = "知识点标签", maxLength = 500)
    private String knowledgeTags;

    @Schema(description = "题号")
    private Integer num;
}
