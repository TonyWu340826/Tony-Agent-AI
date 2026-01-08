package com.tony.service.tonywuai.openapi.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "文档向量检索命中结果")
public class DocSearchHit {

    @Schema(description = "主键")
    private Object id;

    @Schema(description = "向量相似度分数")
    private Double score;

    @Schema(description = "文档类型")
    private String docType;

    @Schema(description = "组织编码")
    private String orgCode;

    @Schema(description = "章节")
    private String section;

    @Schema(description = "chunk 索引")
    private Integer chunkIndex;

    @Schema(description = "chunk 内容")
    private String content;

    @Schema(description = "内容 hash")
    private String contentHash;
}
