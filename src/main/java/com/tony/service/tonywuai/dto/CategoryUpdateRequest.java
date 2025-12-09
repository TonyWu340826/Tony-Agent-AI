package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Category Update Request")
public class CategoryUpdateRequest {
    @Schema(description = "New category name", example = "Frontend Development")
    private String name;

    @Schema(description = "New parent category ID", example = "2")
    private Long parentId; 

    @Schema(description = "New category type", example = "1")
    private Integer type; 
}
