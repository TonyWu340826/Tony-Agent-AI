package com.tony.service.tonywuai.openapi;
import com.alibaba.fastjson.JSON;
import com.tony.service.tonywuai.dto.request.*;
import com.tony.service.tonywuai.openapi.base.OpenAIBaseClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class YSWorkFlowClient extends OpenAIBaseClient {


    @Value("${openapi.python.dev_url:http://172.16.86.183:8889}")
    private String dev_baseUrl;

    @Value("${openapi.ys-workflow.path_agent_01:/api/chat/active/chat}")
    private String workflow;


    Logger logger  = LoggerFactory.getLogger(this.getClass());

    /**
     *DeepSeek 模型调用
     * @param request API查询请求配置
     *
     *示例：
     {
     "query": "查询最近10个用户列表",
     "swagger_url": "http://172.16.86.229:9876/v3/api-docs",
     "api_base_url": "http://172.16.86.229:9876",
     "auth": {
     "headers": {
     "Cookie": " locale=zh-Hans; http_diskPath=%2F; http_taskStatus=true; http_Path=%2Fwww%2Fjar%2Fspringboot; 0d095e0ce376e73891008ca9b150657b=yIWzUXxx21nlkKp60SqBEAgVI0k33m0pDZsTLIY-CyI.nhRDG-_tf4zdcgJWdU5uzzU9zPk; JSESSIONID=5D7B68E771137FDA6B2F7159188C898A"
     }
     }
     }
     *
     * @return
     */
    public Map<String, Object> workFlowSeekChat(ApiQueryRequest request) throws Exception {
        logger.info("开始调用MCP工作流");
        if (request == null) {
            throw new IllegalArgumentException("输入不能为空");
        }
        
        String url = dev_baseUrl + workflow;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // 构建请求参数
        Map<String, Object> param = new HashMap<>();
        param.put("query", request.getQuery());
        param.put("swagger_url", request.getSwaggerUrl());
        // 同时支持 api_url 和 api_base_url 两个字段名
        param.put("api_url", request.getApiBaseUrl());
        param.put("api_base_url", request.getApiBaseUrl());
        
        // 处理认证信息
        if (request.getAuth() != null && request.getAuth().getHeaders() != null) {
            param.put("auth", Collections.singletonMap("headers", request.getAuth().getHeaders()));
        }

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(param, headers);
        logger.info("请求参数: {}", JSON.toJSONString( param));
        try {
            // 直接使用 String 类型来接收响应，因为我们不确定具体的响应结构
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                req, 
                String.class
            );
            
            String responseBody = responseEntity.getBody();
            if (responseBody == null || responseBody.isEmpty()) {
                throw new RuntimeException("响应体为空");
            }
            
            logger.info("收到完整响应: {}", responseBody);
            
            // 尝试解析响应体，提取我们需要的部分
            try {
                // 将响应解析为 JSON 对象
                com.alibaba.fastjson.JSONObject jsonResponse = JSON.parseObject(responseBody);

                Object requiredOps = jsonResponse.get("required_operations");
                if (requiredOps == null) {
                    try {
                        com.alibaba.fastjson.JSONObject userIntent = jsonResponse.getJSONObject("user_intent");
                        if (userIntent != null) {
                            requiredOps = userIntent.get("required_operations");
                        }
                    } catch (Exception ignore) {
                        // ignore
                    }
                }
                Object executionResults = jsonResponse.get("execution_results");

                // 尽量保持向后兼容：给出旧的 response 文本字段
                String responseText = null;

                // 检查是否有 execution_results 字段
                if (jsonResponse.containsKey("execution_results")) {
                    com.alibaba.fastjson.JSONArray executionResultsArr = jsonResponse.getJSONArray("execution_results");
                    if (executionResultsArr != null && !executionResultsArr.isEmpty()) {
                        // 获取第一个执行结果
                        com.alibaba.fastjson.JSONObject firstResult = executionResultsArr.getJSONObject(0);
                        if (firstResult != null && firstResult.getBooleanValue("success")) {
                            // 检查是否有 data 字段
                            if (firstResult.containsKey("data")) {
                                com.alibaba.fastjson.JSONObject data = firstResult.getJSONObject("data");
                                if (data != null && data.containsKey("response")) {
                                    responseText = data.getString("response");
                                }
                            }
                        }
                    }
                }

                // 如果 execution_results 中没有找到响应，检查是否有 response 字段
                if (jsonResponse.containsKey("response")) {
                    responseText = jsonResponse.getString("response");
                }

                // 如果还是没有找到，返回整个响应体
                if (responseText == null) {
                    responseText = responseBody;
                }

                Map<String, Object> out = new LinkedHashMap<>();
                out.put("response", responseText);
                out.put("required_operations", requiredOps);
                out.put("execution_results", executionResults);
                out.put("raw", jsonResponse);
                return out;
            } catch (Exception parseException) {
                logger.warn("解析响应体时发生异常: {}", parseException.getMessage());
                // 如果解析失败，直接返回原始响应（结构化包装）
                Map<String, Object> out = new LinkedHashMap<>();
                out.put("response", responseBody);
                out.put("required_operations", null);
                out.put("execution_results", null);
                out.put("raw", responseBody);
                return out;
            }
        } catch (Exception e) {
            logger.error("调用 MCP 工作流失败，参数: {}, 异常: {}", param, e.getMessage(), e);
            throw new RuntimeException("调用 AI 服务失败", e);
        }
    }













}
