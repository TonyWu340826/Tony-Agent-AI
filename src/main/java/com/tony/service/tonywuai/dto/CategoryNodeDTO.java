package com.tony.service.tonywuai.dto;

import lombok.Data;
import java.util.List;

@Data
public class CategoryNodeDTO {
    private Long id;
    private String name;
    private Integer level;
    private Integer type;
    private List<CategoryNodeDTO> children;
}
