package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "文本生成向量请求")
public class EmbeddingGenerateRequest {

    @Schema(description = "输入文本", example = "杭州天气")
    private String texts;

    @Schema(description = "模型名称", example = "text-embedding-v4")
    private String model;

    @Schema(description = "向量维度，0 表示使用模型默认维度", example = "0")
    private Integer dimensions;
}
