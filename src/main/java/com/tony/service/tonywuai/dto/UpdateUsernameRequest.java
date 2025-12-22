package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新用户名请求。
 *
 * <p>用于已登录用户在“设置”页修改自己的登录用户名。为了避免引入歧义，这里只允许
 * 字母、数字与下划线，并沿用注册时的长度限制。
 */
@Data
@Schema(description = "更新用户名请求")
public class UpdateUsernameRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 50, message = "用户名长度需在4到50个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]{4,50}$", message = "用户名仅支持字母、数字与下划线")
    @Schema(description = "新的登录用户名", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 4, maxLength = 50)
    private String username;
}
