package com.tony.service.tonywuai.service;

import com.alibaba.fastjson.JSONObject;
import com.tony.service.tonywuai.dto.request.ChunkEmbedRequest;
import com.tony.service.tonywuai.openapi.MilvusOpenAiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DocumentUploadFacade {

    private final MilvusOpenAiClient milvusOpenAiClient;

    public String upload(MultipartFile file, String requestJson, ChunkEmbedRequest request) throws Exception {
        if (requestJson != null && !requestJson.isBlank()) {
            request = JSONObject.parseObject(requestJson, ChunkEmbedRequest.class);
        }
        return milvusOpenAiClient.chunkEmbed(file, request);
    }
}
