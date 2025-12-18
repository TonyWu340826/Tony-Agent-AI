package com.tony.service.tonywuai.openapi.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAIBaseClient {

    @Value("${openapi.python.connect-timeout-ms:600000}")
    public int connectTimeoutMs;

    @Value("${openapi.python.read-timeout-ms:600000}")
    public int readTimeoutMs;

    public RestTemplate restTemplate;

    @Value("${openapi.python.url:http://116.62.120.101:8889}")
    public String baseUrl;

    Logger logger  = LoggerFactory.getLogger(this.getClass());

    @jakarta.annotation.PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Math.max(1000, connectTimeoutMs));
        factory.setReadTimeout(Math.max(5000, readTimeoutMs));
        this.restTemplate = new RestTemplate(factory);
        logger.info("AliyunOpenApiClient initialized with connectTimeout: {}ms, readTimeout: {}ms", connectTimeoutMs, readTimeoutMs);
    }


















}
