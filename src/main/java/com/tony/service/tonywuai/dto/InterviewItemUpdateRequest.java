package com.tony.service.tonywuai.dto;

import lombok.Data;

@Data
public class InterviewItemUpdateRequest {
    private Long categoryId;
    private String title;
    private String question;
    private String solution;
    private Integer visibilityVip;
}

