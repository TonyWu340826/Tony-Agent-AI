package com.tony.service.tonywuai.config;

import com.tony.service.tonywuai.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局 API 异常处理器
 * 捕获所有 Controller 抛出的异常，并返回统一的错误格式。
 */
@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * 处理 ResourceNotFoundException (HTTP 404)
     * @param ex 异常对象
     * @param request Web请求
     * @return 包含错误详情的 ResponseEntity
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        // WebRequest.getDescription(false) 返回类似 "uri=/api/v1/configs/1" 的字符串
        body.put("path", request.getDescription(false).substring(4));

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // 这里可以继续添加其他异常处理器，例如处理 @Valid 失败后的 MethodArgumentNotValidException 等。
}