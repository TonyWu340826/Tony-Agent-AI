package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.request.*;
import com.tony.service.tonywuai.openapi.YSWorkFlowClient;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController
@RequestMapping("/api/workFlow")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "workFlow 聚合服务", description = "基于Swagger的接口清单，根据输入的需求自动寻找执行的接口，AI调用纠错，流程观测")
public class WorkFlowController {

    private final YSWorkFlowClient ysWorkFlowClient;
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/swagger-ai")
    @Operation(summary = "智能工作流", description = "智能工作流")
    public ResponseEntity<?> chat(@RequestBody ApiQueryRequest request) {
        try {
            Map<String, Object> resp = ysWorkFlowClient.workFlowSeekChat(request);
            if (resp == null) {
                return ResponseEntity.ok(Map.of("response", "", "required_operations", null, "execution_results", null));
            }
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }










}
