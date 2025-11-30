package com.tony.service.tonywuai.dto;

import lombok.Data;

@Data
public class CategoryCreateRequest {
    private String name;
    private Long parentId; // 可选，顶级为 null
    private Integer type; // 1:文章类型,2:AI工具类型,3:VIP类型
}
