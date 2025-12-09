package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "参数模式项")
class ParamSchemaItem {
    @Schema(description = "参数名称")
    public String name;
    
    @Schema(description = "参数标签")
    public String label;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
