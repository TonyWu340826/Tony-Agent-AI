package com.tony.service.tonywuai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户登录请求 DTO
 */
@Data
public class UserLoginRequest {

    /**
     * 用户名或邮箱 (通常用于登录)
     */
    @NotBlank(message = "用户名不能为空")
    private String username;

    /**
     * 密码
     */
    @NotBlank(message = "密码不能为空")
    private String password;

    private String userType = "0";
}