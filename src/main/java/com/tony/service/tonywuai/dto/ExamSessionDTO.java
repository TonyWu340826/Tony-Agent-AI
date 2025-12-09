package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Schema(description = "考试会话数据传输对象")
public class ExamSessionDTO {
    @Schema(description = "会话ID")
    private Long id;
    
    @Schema(description = "用户ID")
    private Long userId;
    
    @Schema(description = "用户名称")
    private String userName;
    
    @Schema(description = "试卷名称")
    private String paperName;
    
    @Schema(description = "科目")
    private String subject;
    
    @Schema(description = "年级")
    private Integer grade;
    
    @Schema(description = "题目ID列表")
    private String questionIds;
    
    @Schema(description = "分数")
    private BigDecimal score;
    
    @Schema(description = "正确题数")
    private Integer correctNum;
    
    @Schema(description = "错误题数")
    private Integer wrongNum;
    
    @Schema(description = "答题详情JSON")
    private String answerDetailsJson;
    
    @Schema(description = "AI总结")
    private String aiSummary;
    
    @Schema(description = "开始时间")
    private Date startTime;
    
    @Schema(description = "结束时间")
    private Date endTime;
    
    @Schema(description = "创建时间")
    private Date createdAt;
    
    @Schema(description = "状态")
    private Integer status;
    
    @Schema(description = "会话编码")
    private String code;
}
