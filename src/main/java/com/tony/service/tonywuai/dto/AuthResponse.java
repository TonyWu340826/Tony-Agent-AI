package com.tony.service.tonywuai.dto;

import com.tony.service.tonywuai.dto.UserDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 认证响应 DTO (用于注册和登录成功时)
 */
@Data
@Builder
@Schema(description = "认证响应")
public class AuthResponse {
    @Schema(description = "成功生成的JWT Token", requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;

    @Schema(description = "用户信息", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserDTO user;
}
