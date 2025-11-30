package com.tony.service.tonywuai.dto.request;

import com.tony.service.tonywuai.entity.RechargeRecord;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 充值请求 DTO
 */
@Data
public class RechargeRequest {

    /** 充值金额，最小为 0.01 */
    @NotNull(message = "充值金额不能为空")
    @DecimalMin(value = "0.01", message = "充值金额必须大于等于 0.01")
    private BigDecimal amount;

    /** 充值类型: BALANCE (余额) 或 VIP (会员) */
    @NotNull(message = "充值类型不能为空")
    private RechargeRecord.RechargeType type;

    /** 针对 VIP 充值：期望的 VIP 等级 (如 1, 2) */
    private Integer targetVipLevel;
}