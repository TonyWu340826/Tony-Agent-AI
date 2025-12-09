package com.tony.service.tonywuai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

/**
 * 更新用户激活状态的请求 DTO。
 */
@Data
@Schema(description = "更新用户激活状态请求")
public class UserUpdateStatusRequest {

    @NotNull(message = "用户ID不能为空")
    @Schema(description = "用户ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private Long userId;

    @NotNull(message = "激活状态不能为空")
    @Schema(description = "激活状态(true:激活,false:禁用)", requiredMode = Schema.RequiredMode.REQUIRED)
    private Boolean isActive;

    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";
}
