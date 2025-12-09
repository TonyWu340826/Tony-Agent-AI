package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求 DTO
 */
@Data
@Schema(description = "用户注册请求")
public class UserRegistrationRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 50, message = "用户名长度必须在4到50个字符之间")
    @Schema(description = "用户名", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 4, maxLength = 50)
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 30, message = "密码长度必须在6到30个字符之间")
    @Schema(description = "密码", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 6, maxLength = 30)
    private String password;

    @Size(max = 50, message = "昵称长度不能超过50个字符")
    @Schema(description = "昵称", maxLength = 50)
    private String nickname;

    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";
}
