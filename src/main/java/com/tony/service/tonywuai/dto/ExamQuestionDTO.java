package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
@Schema(description = "试题数据传输对象")
public class ExamQuestionDTO {
    @Schema(description = "试题ID")
    private Long id;
    
    @Schema(description = "科目")
    private String subject;
    
    @Schema(description = "年级")
    private Integer grade;
    
    @Schema(description = "题目类型")
    private String type;
    
    @Schema(description = "题目内容")
    private String content;
    
    @Schema(description = "选项JSON")
    private String optionsJson;
    
    @Schema(description = "正确答案")
    private String correctAnswer;
    
    @Schema(description = "答案解析")
    private String explanation;
    
    @Schema(description = "知识点标签")
    private String knowledgeTags;
    
    @Schema(description = "题号")
    private Integer num;
    
    @Schema(description = "创建时间")
    private Date createdAt;
    
    @Schema(description = "更新时间")
    private Date updatedAt;
}
