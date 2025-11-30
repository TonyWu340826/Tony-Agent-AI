package com.tony.service.tonywuai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 自定义资源未找到异常。
 * 当请求的资源（如数据库中的记录）不存在时抛出。
 * 虽然通过全局处理器处理，但添加 @ResponseStatus 确保了默认的 HTTP 404 状态码。
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    /**
     * 构造函数，包含资源名称、字段名和字段值
     * @param resourceName 资源名称 (e.g., "SystemConfig")
     * @param fieldName 字段名称 (e.g., "id")
     * @param fieldValue 字段值 (e.g., 1L)
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }

    /**
     * 简单的消息构造函数
     * @param message 异常详细信息
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}