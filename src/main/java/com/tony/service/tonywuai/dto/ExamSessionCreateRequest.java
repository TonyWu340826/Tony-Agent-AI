package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "考试会话创建请求")
public class ExamSessionCreateRequest {
    @Schema(description = "用户ID")
    private Long userId;
    
    @Schema(description = "用户名称")
    private String userName;
    
    @Size(max = 100)
    @Schema(description = "试卷名称", maxLength = 100)
    private String paperName;
    
    @Size(max = 20)
    @Schema(description = "科目", maxLength = 20)
    private String subject;
    
    @Schema(description = "年级")
    private Integer grade;
    
    @Schema(description = "题目ID列表")
    private String questionIds;
    
    @Schema(description = "分数")
    private String score;
    
    @Schema(description = "正确题数")
    private Integer correctNum;
    
    @Schema(description = "错误题数")
    private Integer wrongNum;
    
    @Schema(description = "答题详情JSON")
    private String answerDetailsJson;
    
    @Size(max = 2000)
    @Schema(description = "AI总结", maxLength = 2000)
    private String aiSummary;
    
    @Schema(description = "开始时间")
    private String startTime;
    
    @Schema(description = "结束时间")
    private String endTime;
    
    @Schema(description = "状态")
    private Integer status;
    
    @Schema(description = "会话编码")
    private String code;
}
