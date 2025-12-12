package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.request.AliyunCreateImage;
import com.tony.service.tonywuai.openapi.PythonOpenApiClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/open/active")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "专门处理工作流的Ai", description = "提供对话作流等AI能力")
public class ActivetiAIController {

    private final PythonOpenApiClient pythonOpenApiClient;
    Logger logger = LoggerFactory.getLogger(this.getClass());


    /**
     * 直接调用seepseek模型，没有任何
     * @param request
     * @return
     */
    @PostMapping("/aliyunCreateImage")
    @Operation(summary = "调用阿里的文生图接口", description = "调用阿里的文生图接口")
    public ResponseEntity<?> aliyunCreateImage(@RequestBody AliyunCreateImage request) {
        try {
            String resp = pythonOpenApiClient.aliyunCreateImage(request);
            logger.info("工作流执行结束--------------------------------{}", resp);
            if (resp == null) resp = "";
            return ResponseEntity.ok(Map.of("message", resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
        }

    }
































}
