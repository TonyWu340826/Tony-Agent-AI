package com.tony.service.tonywuai.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 文档切分并生成向量（上传文件）请求入参。
 *
 * 说明：
 * - 使用 multipart/form-data 提交。
 * - 本 DTO 仅包含切分参数；文件由 Controller 的 MultipartFile 参数单独接收。
 */
@Data
@Schema(description = "文档切分并生成向量请求")
public class ChunkEmbedRequest {


    @JsonProperty("chunkSize")
    @JsonAlias({"chunk_size", "chunkSize"})
    @Schema(description = "文档切分的数据块大小", example = "512")
    private Integer chunkSize;

    @JsonAlias({"overlap"})
    @Schema(description = "chunk 重叠大小，默认 50", example = "50")
    private Integer overlap;

    @JsonAlias({"model"})
    @Schema(description = "模型", example = "text-embedding-v4")
    private String model;

    @JsonAlias({"dimensions"})
    @Schema(description = "向量维度", example = "1024")
    private Integer dimensions;


    @JsonAlias({"docType"})
    @Schema(description = "文档类型（用于标量过滤/入库）", example = "txt")
    private String docType;

    @JsonAlias({"orgCode"})
    @Schema(description = "组织编码（用于标量过滤/入库）", example = "D10000")
    private String orgCode;



}
