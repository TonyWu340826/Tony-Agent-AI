package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求 DTO
 */
@Data
@Schema(description = "用户注册请求")
public class UserRegisterRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 50, message = "用户名长度需在4到50个字符之间")
    @Schema(description = "登录用户名", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 4, maxLength = 50)
    private String username;

    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少需要6位")
    @Schema(description = "密码(明文)", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 6)
    private String password;

    @Schema(description = "用户昵称(可选)")
    private String nickname;

    @NotBlank(message = "验证码不能为空")
    @Schema(description = "验证码", requiredMode = Schema.RequiredMode.REQUIRED)
    private String captcha;

    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";
}
