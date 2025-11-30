package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求 DTO
 */
@Data
public class UserRegisterRequest {

    /**
     * 登录用户名
     */
    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 50, message = "用户名长度需在4到50个字符之间")
    private String username;

    /**
     * 邮箱
     */
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;

    /**
     * 密码 (明文)
     */
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少需要6位")
    private String password;

    /**
     * 用户昵称 (可选)
     */
    private String nickname;

    @NotBlank(message = "验证码不能为空")
    private String captcha;
}
