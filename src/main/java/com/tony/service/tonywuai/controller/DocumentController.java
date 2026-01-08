package com.tony.service.tonywuai.controller;

import com.alibaba.fastjson.JSONObject;
import com.tony.service.tonywuai.dto.request.ChunkEmbedRequest;
import com.tony.service.tonywuai.openapi.MilvusOpenAiClient;
import com.tony.service.tonywuai.openapi.dto.DocChatRequest;
import com.tony.service.tonywuai.openapi.dto.DocSearchHit;
import com.tony.service.tonywuai.service.DocumentUploadFacade;
import com.tony.service.tonywuai.service.impl.DocumentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @Description good luck
 * @Author yunshan
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2026/1/7
 */

@RestController
@RequestMapping("/api/document/milvus")
@RequiredArgsConstructor
@Tag(name = "知识库向量管理", description = "知识库文档切分,分组,向量化,保存,搜索")
public class DocumentController {

    private final MilvusOpenAiClient milvusOpenAiClient;

    private final DocumentUploadFacade documentUploadFacade;

    @Resource
    private DocumentService documentService;

    /**
     * 上传文档 -> 文档切分 -> chunk 向量化（转发给第三方程序）。
     *
     * 对应第三方 swagger：
     * POST http://localhost:9877/api/embedding/document/chunk-embed
     * Content-Type: multipart/form-data
     * -F file=@demo.txt
     * -F request={"chunkSize":512,"overlap":50,"model":"text-embedding-v4","dimensions":1024,"docType":"txt","orgCode":"D10000"}
     *
     * 本接口保持同样的 form 字段：file + request(JSON 字符串)。
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "request", required = false) String requestJson,
            @ModelAttribute ChunkEmbedRequest request) throws Exception {

        return documentUploadFacade.upload(file, requestJson, request);
    }


    /**
     * 搜索/对话（转发给第三方程序）。
     *
     * 对应第三方 swagger：
     * POST http://localhost:9877/api/embedding/generate
     * Content-Type: application/json
     * {
     *   "texts": "文章大意",
     *   "model": "text-embedding-v4"
     * }
     */
    @PostMapping(value = "/search", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity search(@RequestBody DocChatRequest request) throws Exception {
        return ResponseEntity.ok(documentService.docChat(request));
    }
}
