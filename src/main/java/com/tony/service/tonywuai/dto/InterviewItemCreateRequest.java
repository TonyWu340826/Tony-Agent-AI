package com.tony.service.tonywuai.dto;
import lombok.Data;

@Data
public class InterviewItemCreateRequest {
    private Long categoryId;
    private String title;
    private String question;
    private String solution;
    private Integer visibilityVip;
    private String userType = "0";
}

