package com.tony.service.tonywuai.openapi;

import com.tony.service.tonywuai.dto.request.ChunkEmbedRequest;
import com.tony.service.tonywuai.openapi.base.OpenAIBaseClient;
import com.tony.service.tonywuai.openapi.dto.DocChatRequest;
import com.tony.service.tonywuai.openapi.dto.DocSearchHit;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @Description good luck
 * @Author yunshan
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2026/1/6
 */

@Service
public class MilvusOpenAiClient extends OpenAIBaseClient {



    @Value("${embedding.milvus.url:http://172.16.86.220:9877}")
    private String dev_baseUrl;


    //上传文档生成向量
    @Value("${embedding.milvus.path-01:/api/embedding/document/chunk-embed}")
    private String chunkEmbed;


    //输入文本，返回向量
    @Value("${embedding.milvus.path-02:/api/embedding/generate}")
    private String generate;


    Logger logger  = LoggerFactory.getLogger(this.getClass());

    private final ObjectMapper objectMapper = new ObjectMapper();





    /**
     * 上传文档生成向量
     * @param file
     * @param request
     * @return
     * @throws Exception
     */
    public String chunkEmbed(MultipartFile file,ChunkEmbedRequest request) throws Exception {
        logger.info("Milvus chunk-embed: fileName={}, chunkSize={}, overlap={}, model={}, dimensions={}, docType={}, orgCode={}",
                file != null ? file.getOriginalFilename() : null,
                request != null ? request.getChunkSize() : null,
                request != null ? request.getOverlap() : null,
                request != null ? request.getModel() : null,
                request != null ? request.getDimensions() : null,
                request != null ? request.getDocType() : null,
                request != null ? request.getOrgCode() : null);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file不能为空");
        }
        if (request == null) {
            request = new ChunkEmbedRequest();
        }

        Integer chunkSize = request.getChunkSize() == null || request.getChunkSize() <= 0 ? 512 : request.getChunkSize();
        Integer overlap = request.getOverlap() == null || request.getOverlap() < 0 ? 50 : request.getOverlap();
        request.setChunkSize(chunkSize);
        request.setOverlap(overlap);

        String url = dev_baseUrl + chunkEmbed;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        HttpHeaders fileHeaders = new HttpHeaders();
        MediaType fileContentType = MediaType.APPLICATION_OCTET_STREAM;
        if (file.getContentType() != null && !file.getContentType().isBlank()) {
            fileContentType = MediaType.parseMediaType(file.getContentType());
        }
        fileHeaders.setContentType(fileContentType);
        body.add("file", new HttpEntity<>(fileResource, fileHeaders));

        // 1) 按 swagger 要求：multipart/form-data 中的 request 字段是一个 JSON 字符串。
        String requestJson = objectMapper.writeValueAsString(request);
        logger.debug("Milvus chunk-embed request JSON: {}", requestJson);
        body.add("request", requestJson);

        // 2) 为了和 EmbeddingOpenAiClient 的实现一致、便于调试（在 body 里能直观看到每个参数），
        //    这里额外把关键参数拆成独立的 form 字段提交。
        body.add("chunk_size", String.valueOf(chunkSize));
        body.add("overlap", String.valueOf(overlap));
        if (request.getModel() != null && !request.getModel().isBlank()) {
            body.add("model", request.getModel());
        }
        if (request.getDimensions() != null && request.getDimensions() > 0) {
            body.add("dimensions", String.valueOf(request.getDimensions()));
        }
        if (request.getDocType() != null && !request.getDocType().isBlank()) {
            body.add("docType", request.getDocType());
        }
        if (request.getOrgCode() != null && !request.getOrgCode().isBlank()) {
            body.add("orgCode", request.getOrgCode());
        }

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }




    /**
     * 输入文本，返回向量
     * @param request
     * @return
     * @throws Exception
     */
    public List<DocSearchHit> docChat(@RequestBody DocChatRequest request) throws Exception {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("texts不能为空");
        }

        String url = dev_baseUrl + generate;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // 第三方 swagger: {"texts":"...","model":"text-embedding-v4"}
        HttpEntity<DocChatRequest> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<List<DocSearchHit>> typedResp = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<List<DocSearchHit>>() {}
            );
            List<DocSearchHit> body = typedResp.getBody();
            return body != null ? body : new ArrayList<>();
        } catch (Exception ex) {
            // 兼容第三方返回结构不是纯数组的情况：例如 {"data":[...]} / {"hits":[...]}
            logger.warn("Milvus docChat typed parse failed, fallback to JsonNode parse. url={}, err={}", url, ex.getMessage());
            ResponseEntity<String> rawResp = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            String raw = rawResp.getBody();
            if (raw == null || raw.isBlank()) {
                return new ArrayList<>();
            }

            JsonNode root = objectMapper.readTree(raw);
            JsonNode arrNode = null;
            if (root.isArray()) {
                arrNode = root;
            } else if (root.isObject()) {
                if (root.has("data")) {
                    arrNode = root.get("data");
                } else if (root.has("hits")) {
                    arrNode = root.get("hits");
                } else if (root.has("result")) {
                    arrNode = root.get("result");
                }
            }

            if (arrNode != null && arrNode.isArray()) {
                return objectMapper.convertValue(arrNode, new com.fasterxml.jackson.core.type.TypeReference<List<DocSearchHit>>() {});
            }

            return new ArrayList<>();
        }
    }


























}
