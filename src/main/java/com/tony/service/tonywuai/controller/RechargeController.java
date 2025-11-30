package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.request.RechargeRequest;
import com.tony.service.tonywuai.dto.response.RechargeResponse;
import com.tony.service.tonywuai.entity.RechargeRecord;
import com.tony.service.tonywuai.service.RechargeService;
import com.tony.service.tonywuai.repository.RechargeRecordRepository;
import com.tony.service.tonywuai.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 充值和 VIP 会员购买控制器
 */
@RestController
@RequestMapping("/api/recharge")
@RequiredArgsConstructor
public class RechargeController {

    private final RechargeService rechargeService;
    private final RechargeRecordRepository rechargeRecordRepository;
    private final UserRepository userRepository;

    /**
     * POST /api/recharge/order
     * 步骤 1: 创建充值订单，并返回支付信息
     * @param principal 认证主体 (用于获取用户ID)
     * @param request 充值请求 DTO
     * @return 订单创建结果
     */
    @PostMapping("/order")
    public ResponseEntity<RechargeResponse> createOrder(@AuthenticationPrincipal UserDetails principal,
                                                        @Valid @RequestBody RechargeRequest request) {
        // 实际应用中需要从 UserDetails 或 UserService 获取真正的用户ID
        // 这里为了简化，我们假设用户名为 Long 类型的 ID
        Long userId = Long.parseLong(principal.getUsername());

        try {
            RechargeRecord record = rechargeService.createRechargeOrder(userId, request);

            // 实际支付集成时，这里会调用支付宝/微信API，返回一个支付URL或二维码数据
            // 当前为模拟返回
            String mockPayUrl = "/mock-payment-gateway?trade_no=" + record.getTradeNo();

            return ResponseEntity.ok(RechargeResponse.builder()
                    .success(true)
                    .message("充值订单创建成功，请前往支付")
                    .tradeNo(record.getTradeNo())
                    .payUrl(mockPayUrl)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(RechargeResponse.builder()
                    .success(false)
                    .message("订单创建失败: " + e.getMessage())
                    .build());
        }
    }

    // --- 管理员：充值记录管理 ---

    /** 列表分页（简单过滤） */
    @GetMapping("/admin")
    public ResponseEntity<?> adminList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String tradeNo
    ) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), size);
        var all = (userId != null) ? rechargeRecordRepository.findAllByUserIdOrderByRechargeDateDesc(userId) : rechargeRecordRepository.findAllByOrderByRechargeDateDesc();
        var filtered = all.stream()
                .filter(r -> tradeNo == null || tradeNo.isBlank() || (r.getTradeNo()!=null && r.getTradeNo().contains(tradeNo)))
                .toList();
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        var slice = filtered.subList(start, end);
        var dto = slice.stream().map(r -> java.util.Map.of(
                "id", r.getId(),
                "userId", r.getUserId(),
                "amount", r.getAmount(),
                "type", r.getType(),
                "status", r.getStatus(),
                "tradeNo", r.getTradeNo(),
                "rechargeDate", r.getRechargeDate()
        )).toList();
        var pageObj = new org.springframework.data.domain.PageImpl<>(dto, pageable, filtered.size());
        return ResponseEntity.ok(pageObj);
    }

    /** 管理员手工新增成功记录（触发VIP5） */
    @PostMapping("/admin/manual")
    public ResponseEntity<?> adminManualAdd(@RequestBody java.util.Map<String,Object> body) {
        try {
            Long userId = Long.valueOf(String.valueOf(body.get("userId")));
            java.math.BigDecimal amount = new java.math.BigDecimal(String.valueOf(body.get("amount")));
            String typeStr = String.valueOf(body.get("type"));
            RechargeRecord.RechargeType type = (typeStr==null||typeStr.isBlank()) ? RechargeRecord.RechargeType.BALANCE : RechargeRecord.RechargeType.valueOf(typeStr);
            if (userRepository.findById(userId).isEmpty()) {
                return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "message", "用户不存在: "+userId));
            }
            RechargeRecord r = rechargeService.manualSuccess(userId, amount, type);
            return ResponseEntity.ok(java.util.Map.of("success", true, "id", r.getId(), "tradeNo", r.getTradeNo()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * GET /api/recharge/callback/success?trade_no=...
     * 步骤 2: 模拟支付网关回调成功接口
     * 实际中这通常是 POST 请求，且需要签名校验，此处简化为 GET
     * @param tradeNo 交易流水号
     * @return 交易处理结果
     */
    @GetMapping("/callback/success")
    public ResponseEntity<?> paymentSuccessCallback(@RequestParam("trade_no") String tradeNo) {
        try {
            rechargeService.handlePaymentSuccess(tradeNo);
            return ResponseEntity.ok(Map.of("success", true, "message", "支付成功，账户/VIP已更新。", "tradeNo", tradeNo));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "支付处理失败: " + e.getMessage(), "tradeNo", tradeNo));
        }
    }

    /**
     * GET /api/recharge/callback/fail?trade_no=...
     * 步骤 3: 模拟支付网关回调失败接口
     * @param tradeNo 交易流水号
     * @return 交易处理结果
     */
    @GetMapping("/callback/fail")
    public ResponseEntity<?> paymentFailureCallback(@RequestParam("trade_no") String tradeNo) {
        try {
            rechargeService.handlePaymentFailure(tradeNo);
            return ResponseEntity.ok(Map.of("success", true, "message", "支付失败，订单状态已更新。", "tradeNo", tradeNo));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "支付失败处理异常: " + e.getMessage(), "tradeNo", tradeNo));
        }
    }
}
