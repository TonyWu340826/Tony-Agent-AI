package com.tony.service.tonywuai.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * 充值订单创建响应 DTO
 */
@Data
@Builder
public class RechargeResponse {
    private Boolean success;
    private String message;
    private String tradeNo; // 交易流水号
    private String payUrl;  // 实际支付链接 (此处为模拟)
}