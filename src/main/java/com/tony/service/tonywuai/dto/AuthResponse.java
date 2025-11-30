package com.tony.service.tonywuai.dto;

import com.tony.service.tonywuai.dto.UserDTO;
import lombok.Builder;
import lombok.Data;

/**
 * 认证响应 DTO (用于注册和登录成功时)
 */
@Data
@Builder
public class AuthResponse {
    /**
     * 成功生成的 JWT Token
     */
    private String token;

    /**
     * 用户信息
     */
    private UserDTO user;
}