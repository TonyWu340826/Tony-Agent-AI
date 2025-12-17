package com.tony.service.tonywuai.openapi;
import com.alibaba.fastjson.JSON;
import com.tony.service.tonywuai.dto.request.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class AliyunOpenApiClient {


    @Value("${openapi.python.url:http://116.62.120.101:8889}")
    private String baseUrl;

    @Value("${openapi.python.dev_url:http://172.16.86.183:8889}")
    private String dev_baseUrl;

    @Value("${openapi.tongyi.video.path_01:/api/ai/aliyun_ai/video/videoSynthesis}") // 使用相对路径
    private String path;
    
    @Value("${openapi.python.connect-timeout-ms:600000}")
    private int connectTimeoutMs;
    
    @Value("${openapi.python.read-timeout-ms:600000}")
    private int readTimeoutMs;

    private RestTemplate restTemplate;



    Logger logger  = LoggerFactory.getLogger(this.getClass());
    public AliyunOpenApiClient() { }

    @jakarta.annotation.PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Math.max(1000, connectTimeoutMs));
        factory.setReadTimeout(Math.max(5000, readTimeoutMs));
        this.restTemplate = new RestTemplate(factory);
        logger.info("AliyunOpenApiClient initialized with connectTimeout: {}ms, readTimeout: {}ms", connectTimeoutMs, readTimeoutMs);
    }



    /**
     * 调用阿里的文生视频接口
     *
     * @param request 包含prompt, model等参数
     * @return 生成的视频URL
     * @throws Exception 若请求失败或返回错误
     */
    public String create_viedo(VideoGenerationRequest request) throws Exception {
        logger.info("开始调用阿里文生视频接口{}", JSON.toJSONString(request));
        String url = dev_baseUrl + path;

        logger.info("开始调用阿里文生视频接口URL>>>{}", url);
        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 构建请求体参数
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("prompt", request.getPrompt());
        //分辨率
        requestBody.put("model", request.getModel());
        //视频时长
        requestBody.put("duration", request.getDuration());
        requestBody.put("size", request.getSize());
        requestBody.put("negative_prompt", request.getNegativePrompt());
        requestBody.put("audio", request.getAudio());
        requestBody.put("audio_url", request.getAudioUrl());
        requestBody.put("watermark", request.getWatermark());

        logger.info("开始调用阿里文生视频接口参数>>>{}", JSON.toJSONString(requestBody));
        // 创建HttpEntity
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 发送POST请求，增加超时处理
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                String.class
            );

            // 处理响应
            logger.info("阿里文生视频接口响应状态码: {}", response.getStatusCode());
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                logger.info("阿里文生视频接口响应体: {}", responseBody);
                
                // 解析返回的JSON，提取video_url
                if (responseBody != null && !responseBody.isEmpty()) {
                    Map<String, Object> resultMap = JSON.parseObject(responseBody, Map.class);
                    Object videoUrlObj = resultMap.get("video_url");
                    
                    if (videoUrlObj != null) {
                        String videoUrl = videoUrlObj.toString();
                        logger.info("成功提取视频URL: {}", videoUrl);
                        return videoUrl;
                    } else {
                        logger.warn("响应中未找到video_url字段，完整响应: {}", responseBody);
                        throw new Exception("接口返回格式错误，未找到视频URL");
                    }
                } else {
                    throw new Exception("接口返回空响应");
                }
            } else {
                throw new Exception("调用阿里文生视频接口失败，状态码: " + response.getStatusCode());
            }
        } catch (ResourceAccessException e) {
            logger.error("调用阿里文生视频接口网络异常: ", e);
            throw new Exception("网络请求超时或无法连接到服务，请稍后重试", e);
        } catch (Exception e) {
            logger.error("调用阿里文生视频接口发生异常: ", e);
            throw new Exception("调用接口失败: " + e.getMessage(), e);
        }
    }
}