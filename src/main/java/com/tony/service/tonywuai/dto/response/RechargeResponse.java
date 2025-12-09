package com.tony.service.tonywuai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 充值订单创建响应 DTO
 */
@Data
@Builder
@Schema(description = "充值订单创建响应")
public class RechargeResponse {
    @Schema(description = "是否成功")
    private Boolean success;
    
    @Schema(description = "响应消息")
    private String message;
    
    @Schema(description = "交易流水号")
    private String tradeNo;
    
    @Schema(description = "实际支付链接(此处为模拟)")
    private String payUrl;
}
