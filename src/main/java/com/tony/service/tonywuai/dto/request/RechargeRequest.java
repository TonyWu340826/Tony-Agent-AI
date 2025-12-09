package com.tony.service.tonywuai.dto.request;

import com.tony.service.tonywuai.entity.RechargeRecord;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 充值请求 DTO
 */
@Data
@Schema(description = "充值请求")
public class RechargeRequest {

    @NotNull(message = "充值金额不能为空")
    @DecimalMin(value = "0.01", message = "充值金额必须大于等于 0.01")
    @Schema(description = "充值金额,最小为0.01", requiredMode = Schema.RequiredMode.REQUIRED, minimum = "0.01")
    private BigDecimal amount;

    @NotNull(message = "充值类型不能为空")
    @Schema(description = "充值类型:BALANCE(余额)|VIP(会员)", requiredMode = Schema.RequiredMode.REQUIRED)
    private RechargeRecord.RechargeType type;

    @Schema(description = "针对VIP充值:期望的VIP等级(如1,2)")
    private Integer targetVipLevel;
}
