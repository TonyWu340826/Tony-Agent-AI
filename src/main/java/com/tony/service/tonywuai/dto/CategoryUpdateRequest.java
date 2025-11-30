package com.tony.service.tonywuai.dto;

import lombok.Data;

@Data
public class CategoryUpdateRequest {
    private String name;
    private Long parentId; // 可选
    private Integer type; // 可选
}
