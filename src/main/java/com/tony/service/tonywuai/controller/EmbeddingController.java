package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.request.EmbeddingGenerateRequest;
import com.tony.service.tonywuai.openapi.EmbeddingOpenAiClient;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @Description good luck
 * @Author yunshan
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2026/1/6
 */

@RestController
@RequestMapping("/api/embedding")
@RequiredArgsConstructor
@Tag(name = "向量管理", description = "生成向量。切分")
public class EmbeddingController {


    private final EmbeddingOpenAiClient embeddingOpenAiClient;


    /**
     * 生成文档向量数据
     * @param file
     * @param chunkSize
     * @param overlap
     * @param model
     * @param dimensions
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/document/chunk-embed", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String chunkEmbed(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "chunk_size", required = false) Integer chunkSize,
            @RequestParam(value = "overlap", required = false) Integer overlap,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "dimensions", required = false) Integer dimensions
    ) throws Exception {
        return embeddingOpenAiClient.chunkEmbed(file, chunkSize, overlap, model, dimensions);
    }


    /**
     * 生成向量用于搜索
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public String generate(@RequestBody EmbeddingGenerateRequest request) throws Exception {
        return embeddingOpenAiClient.generate(request.getTexts(), request.getModel(), request.getDimensions());
    }













}
