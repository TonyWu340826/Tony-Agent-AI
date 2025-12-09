package com.tony.service.tonywuai.openapi;
import com.alibaba.fastjson.JSON;
import com.tony.service.tonywuai.dto.request.AliyunCreateImage;
import com.tony.service.tonywuai.dto.request.CozeWorkFlowRequest;
import com.tony.service.tonywuai.dto.request.ReplyData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import java.util.*;

import static com.tony.service.tonywuai.com.ComStatus.TYPE_AUTO_CASE;
import static com.tony.service.tonywuai.com.ComStatus.TYPE_CASE_CHECK;

@Service
public class PythonOpenApiClient {

    @Value("${openapi.python.url:http://116.62.120.101:8889}")
    private String baseUrl;
    @Value("${openapi.tongyi.agent.path_agent_01:/api/user/user/aliyun/chat}")
    private String path_agent_01;
    @Value("${openapi.deepseek.api.ask_base_path:/api/chat/ask-base}")
    private String deepSeekPath;
    @Value("${openapi.coze.workflow_path:/api/coze/run-workflow}")
    private String workFlowPath;
    @Value("${openapi.tongyi.image.path_01:/api/user/user/aliyun/image_create}")
    private String imageCreatePath;
    @Value("${openapi.python.connect-timeout-ms:600000}")
    private int connectTimeoutMs;
    @Value("${openapi.python.read-timeout-ms:600000}")
    private int readTimeoutMs;

    private RestTemplate restTemplate;



    Logger logger  = LoggerFactory.getLogger(this.getClass());
    public PythonOpenApiClient() { }

    @jakarta.annotation.PostConstruct
    public void init() {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(Math.max(1000, connectTimeoutMs));
        f.setReadTimeout(Math.max(5000, readTimeoutMs));
        this.restTemplate = new RestTemplate(f);
    }


    /**
     * 同义万象智能体
     * @param prompt
     * @return
     */
    public String chat(String prompt) {
        logger.info("开始调用同义万象智能体：{}",prompt);
        String url = baseUrl + path_agent_01;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        HttpEntity<Map<String, String>> req = new HttpEntity<>(Map.of("prompt", prompt), headers);
        ResponseEntity<PythonChatResponse> resp = restTemplate.postForEntity(url, req, PythonChatResponse.class);
        PythonChatResponse body = resp.getBody();
        return body != null ? body.getResponse() : null;
    }


    /**
     *DeepSeek 模型调用
     * @param message 用户输入   -user
     * @param prompt  提示词    -system
     * @param context  上下文   -assistant
     *
     *
     *示例：
     *                 {
     *   "messages": [
     *     {"role": "system", "content": "你是一个书籍推荐专家"},
     *     {"role": "user", "content": "推荐一本适合孩子的书"},
     *     {"role": "assistant", "content": "《强风吹拂》是一本关于团队合作和成长的书..."},
     *     {"role": "user", "content": "这本书适合几岁孩子？"}
     *   ]
     * }
     *
     * @return
     */
    public String deepSeekChat(String message, String prompt, String context) throws Exception {
        logger.info("开始调用DeepSeek");
        if (StringUtils.isEmpty(message)) {
            throw new IllegalArgumentException("输入不能为空");
        }
        String url = baseUrl + deepSeekPath;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, String> param = new HashMap<>();
        param.put("user_message", message.trim());
        if (StringUtils.hasText(prompt)) {
            param.put("system_prompt", prompt);
        }
        HttpEntity<Map<String, String>> req = new HttpEntity<>(param, headers);
        try {
            // 使用 ParameterizedTypeReference 指定泛型
            ResponseEntity<PythonChatResponse<ReplyData>> responseEntity = restTemplate.exchange(url, HttpMethod.POST, req, new ParameterizedTypeReference<PythonChatResponse<ReplyData>>() {});
            PythonChatResponse<ReplyData> body = responseEntity.getBody();
            if (body == null) {
                throw new RuntimeException("响应体为空");
            }
            ReplyData data = body.getData();
            return data != null ? data.getReply() : null;
        } catch (Exception e) {
            logger.error("调用 DeepSeek 失败，参数: {}, 异常: {}", param, e.getMessage(), e);
            throw new RuntimeException("调用 AI 服务失败", e);
        }
    }


    /**
     * 扣子调用工作流的接口
     *
     * @param request 入参
     * @return AI 返回的响应内容
     * @throws Exception 请求参数非法或调用失败
     */
    public String cozeWorkFlow(CozeWorkFlowRequest request) throws Exception {
        String type = request.getType();
        logger.info("开始调用扣子工作流接口，类型: {}", type);
        // 参数校验与构建
        Map<String, String> param = new HashMap<>();
        param.put("type", request.getType());
        if (TYPE_AUTO_CASE.equals(type)) {
            // autoCase：documentId 和 input 互斥
            String documentId = request.getDocumentId();
            String input = request.getInput();
            String mail = request.getMail();
            if (StringUtils.hasText(documentId)) {
                param.put("document_id", documentId);
            }
            if (StringUtils.hasText(input)) {
                param.put("input1", input);
            }
            if (StringUtils.hasText(mail)) {
                param.put("mail", mail);
            } else {
                throw new IllegalArgumentException("邮箱地址（mail）不能为空");
            }
        } else if (TYPE_CASE_CHECK.equals(type)) {
            String mail = request.getMail();
            String caseToken = request.getCaseToken();
            if (!StringUtils.hasText(mail)) {
                throw new IllegalArgumentException("邮箱地址（mail）不能为空");
            }
            if (!StringUtils.hasText(caseToken)) {
                throw new IllegalArgumentException("用例标识（caseToken）不能为空");
            }
            param.put("mail", mail);
            param.put("test_case_url_token", caseToken);
        } else {
            throw new IllegalArgumentException("不支持的工作流类型: " + type);
        }
        // 构造请求
        String url = baseUrl + workFlowPath;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, String>> req = new HttpEntity<>(param, headers);

        try {
            ResponseEntity<PythonChatResponse> resp = restTemplate.postForEntity(url, req, PythonChatResponse.class);
            PythonChatResponse body = resp.getBody();
            if (body == null) {
                logger.warn("扣子工作流返回空响应体");
                return null;
            }
            return body.getMessage();
        } catch (Exception e) {
            logger.error("调用扣子工作流失败，类型: {}, 参数: {}, 异常: {}", type, param, e.getMessage(), e);
            throw new RuntimeException("调用扣子工作流失败", e);
        }
    }


    /**
     * 调用阿里的文生图接口
     *
     * @param aliyunCreateImage 包含prompt, negative_prompt, size等信息的对象
     * @return 生成的图片URL
     * @throws Exception 若请求失败或返回错误
     */
    public String aliyunCreateImage(AliyunCreateImage aliyunCreateImage) throws Exception {
        // 记录请求日志
        System.out.println("开始调用阿里云同义文生图request>>>>>>" + JSON.toJSONString(aliyunCreateImage));

        // 完整请求URL
        String url = baseUrl + imageCreatePath;

        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // 创建请求体
        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("prompt", aliyunCreateImage.getPrompt());
        requestBody.add("negative_prompt", aliyunCreateImage.getNegativePrompt());
        requestBody.add("size", aliyunCreateImage.getSize());

       // 创建HttpEntity对象，包含请求体和请求头
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // 发送POST请求并接收响应
        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
        // 解析响应体获取image_url
        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("image_url")) {
            return (String) responseBody.get("image_url");
        } else {
            throw new Exception("未能从响应中获取'image_url'");
        }
    }
























}
