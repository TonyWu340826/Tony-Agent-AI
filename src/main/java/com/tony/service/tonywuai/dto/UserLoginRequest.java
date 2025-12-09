package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户登录请求 DTO
 */
@Data
@Schema(description = "用户登录请求")
public class UserLoginRequest {

    @NotBlank(message = "用户名不能为空")
    @Schema(description = "用户名或邮箱", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";
}
