package com.tony.service.tonywuai.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "面试题创建请求")
public class InterviewItemCreateRequest {
    @Schema(description = "分类ID")
    private Long categoryId;
    
    @Schema(description = "题目标题")
    private String title;
    
    @Schema(description = "面试问题")
    private String question;
    
    @Schema(description = "问题解答")
    private String solution;
    
    @Schema(description = "VIP可见性")
    private Integer visibilityVip;
    
    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";
}
