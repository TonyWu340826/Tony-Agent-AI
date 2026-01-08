package com.tony.service.tonywuai.openapi;

import com.tony.service.tonywuai.openapi.base.OpenAIBaseClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * @Description good luck
 * @Author yunshan
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2026/1/6
 */

@Service
public class EmbeddingOpenAiClient extends OpenAIBaseClient {



    @Value("${embedding.model.url:http://172.16.86.220:8889}")
    private String dev_baseUrl;


    //上传文档，返回向量
    @Value("${embedding.model.path-02:/api/embedding/java/document/chunk-embed}")
    private String chunkEmbed;


    //输入文本，返回向量
    @Value("${embedding.model.path-01:/api/embedding/generate}")
    private String generate;



    Logger logger  = LoggerFactory.getLogger(this.getClass());



    /**
     * #传文件 -> 文档切分 -> 每个 chunk 生成向量 -> 返回向量。
     * @param file 上传的文件
     * @param chunkSize 块大小
     * @param overlap 重叠大小
     * @param model 模型名称
     * @param dimensions 维度
     * @return
     * @throws Exception
     */
    public String chunkEmbed(MultipartFile file, Integer chunkSize, Integer overlap, String model, Integer dimensions) throws Exception {
        logger.info("根据文档，进行文档切分生成向量数据 fileName={}, chunkSize={}, overlap={}, model={}, dimensions={}",
                file != null ? file.getOriginalFilename() : null, chunkSize, overlap, model, dimensions);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file不能为空");
        }

        int finalChunkSize = (chunkSize == null || chunkSize <= 0) ? 512 : chunkSize;
        int finalOverlap = (overlap == null || overlap < 0) ? 50 : overlap;

        String url = UriComponentsBuilder
                .fromUriString(dev_baseUrl + chunkEmbed)
                .queryParam("chunk_size", finalChunkSize)
                .queryParam("overlap", finalOverlap)
                .queryParam("model", model)
                .queryParam("dimensions", dimensions)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        HttpHeaders partHeaders = new HttpHeaders();
        MediaType partContentType = MediaType.APPLICATION_OCTET_STREAM;
        if (file.getContentType() != null && !file.getContentType().isBlank()) {
            partContentType = MediaType.parseMediaType(file.getContentType());
        }
        partHeaders.setContentType(partContentType);
        body.add("file", new HttpEntity<>(fileResource, partHeaders));

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        logger.info("开始上传文档到python url={}, fileName={}, size={}, contentType={}, chunkSize={}, overlap={}",
                url,
                file.getOriginalFilename(),
                file.getSize(),
                file.getContentType(),
                finalChunkSize,
                finalOverlap);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }


    /**
     *
     * @param text
     * @param model
     * @param dimensions
     * @return
     * @throws Exception
     */
    public String generate(String text, String model, Integer dimensions) throws Exception {
        logger.info("根据文本，生成向量数据 text={}, model={}, dimensions={}", text, model, dimensions);
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("texts不能为空");
        }

        String url = dev_baseUrl + generate;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new HashMap<>();
        body.put("texts", text);
        body.put("model", model);
        body.put("dimensions", dimensions == null ? 0 : dimensions);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }












}
