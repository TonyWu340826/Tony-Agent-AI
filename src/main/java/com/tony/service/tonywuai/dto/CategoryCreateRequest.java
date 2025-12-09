package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Category Creation Request")
public class CategoryCreateRequest {
    @Schema(description = "Category name", example = "Backend Development", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "Parent category ID (null for root category)", example = "1")
    private Long parentId; 

    @Schema(description = "Category type (1: Article, 2: AI Tool, 3: VIP)", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer type; 
}
