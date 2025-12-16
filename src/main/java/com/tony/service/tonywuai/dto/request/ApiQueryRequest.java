package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * API查询请求配置 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "API查询请求配置")
public class ApiQueryRequest {

    @Schema(description = "查询语句")
    private String query;

    @Schema(description = "Swagger文档地址")
    private String swaggerUrl;

    @Schema(description = "API基础地址")
    private String apiBaseUrl;

    @Schema(description = "认证信息")
    private AuthInfo auth;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "认证信息")
    public static class AuthInfo {
        
        @Schema(description = "请求头信息")
        private Map<String, String> headers;
    }
}