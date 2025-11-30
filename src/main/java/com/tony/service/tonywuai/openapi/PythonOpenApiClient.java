package com.tony.service.tonywuai.openapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class PythonOpenApiClient {

    @Value("${openapi.python.base-url:http://116.62.120.101:8889}")
    private String baseUrl;
    @Value("${openapi.python.path_agent_01:/api/user/user/aliyun/chat}")
    private String path_agent_01;
    @Value("${openapi.python.connect-timeout-ms:60000}")
    private int connectTimeoutMs;
    @Value("${openapi.python.read-timeout-ms:60000}")
    private int readTimeoutMs;

    private RestTemplate restTemplate;

    public PythonOpenApiClient() { }

    @jakarta.annotation.PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(Math.max(1000, connectTimeoutMs));
        f.setReadTimeout(Math.max(5000, readTimeoutMs));
        this.restTemplate = new RestTemplate(f);
    }

    public String chat(String prompt) {
        String url = baseUrl + path_agent_01;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of("prompt", prompt), headers);
        ResponseEntity<PythonChatResponse> resp = restTemplate.postForEntity(url, req, PythonChatResponse.class);
        PythonChatResponse body = resp.getBody();
        return body != null ? body.getResponse() : null;
    }
}
