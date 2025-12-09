package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "Category Tree Node")
public class CategoryNodeDTO {
    @Schema(description = "Category ID")
    private Long id;

    @Schema(description = "Category name")
    private String name;

    @Schema(description = "Hierarchy level (depth)")
    private Integer level;

    @Schema(description = "Category type")
    private Integer type;

    @Schema(description = "Child categories")
    private List<CategoryNodeDTO> children;
}
