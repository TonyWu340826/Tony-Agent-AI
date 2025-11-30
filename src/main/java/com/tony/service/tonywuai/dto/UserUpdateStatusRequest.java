package com.tony.service.tonywuai.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

/**
 * 更新用户激活状态的请求 DTO。
 */
@Data
public class UserUpdateStatusRequest {

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @NotNull(message = "激活状态不能为空")
    private Boolean isActive; // true: 激活, false: 禁用
}