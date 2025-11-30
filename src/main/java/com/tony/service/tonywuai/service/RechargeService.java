package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.request.RechargeRequest;
import com.tony.service.tonywuai.entity.RechargeRecord;
import com.tony.service.tonywuai.repository.RechargeRecordRepository;
import com.tony.service.tonywuai.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 充值和会员业务服务
 */
@Service
@RequiredArgsConstructor
public class RechargeService {

    private final UserRepository userRepository;
    private final RechargeRecordRepository rechargeRecordRepository;

    /**
     * 1. 创建充值订单 (模拟支付网关的第一步)
     * @param userId 当前用户ID
     * @param request 充值请求
     * @return 包含交易流水号的响应
     */
    @Transactional
    public RechargeRecord createRechargeOrder(Long userId, RechargeRequest request) {
        // 校验逻辑
        if (request.getType() == RechargeRecord.RechargeType.VIP && (request.getTargetVipLevel() == null || request.getTargetVipLevel() <= 0)) {
            throw new IllegalArgumentException("购买 VIP 会员必须指定有效的 VIP 等级。");
        }

        RechargeRecord record = new RechargeRecord();
        record.setUserId(userId);
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setTradeNo(UUID.randomUUID().toString().replaceAll("-", "")); // 生成唯一交易流水号
        record.setStatus(RechargeRecord.RechargeStatus.PENDING); // 初始状态为待支付
        record.setRechargeDate(LocalDateTime.now());

        return rechargeRecordRepository.save(record);
    }

    /**
     * 2. 模拟支付成功回调处理
     * @param tradeNo 交易流水号
     */
    @Transactional
    public void handlePaymentSuccess(String tradeNo) {
        RechargeRecord record = rechargeRecordRepository.findByTradeNo(tradeNo)
                .orElseThrow(() -> new RuntimeException("交易流水号不存在: " + tradeNo));

        if (record.getStatus() == RechargeRecord.RechargeStatus.SUCCESS) {
            // 幂等性检查
            return;
        }

        // 1. 更新记录状态
        record.setStatus(RechargeRecord.RechargeStatus.SUCCESS);
        rechargeRecordRepository.save(record);

        // 2. 更新用户账户
        userRepository.findById(record.getUserId()).ifPresent(user -> {
            if (record.getType() == RechargeRecord.RechargeType.BALANCE) {
                user.setBalance(user.getBalance().add(record.getAmount()));
            }
            user.setVipLevel(99);
            userRepository.save(user);
        });
    }

    /**
     * 管理员手工新增成功充值记录，并触发 VIP5
     */
    @Transactional
    public RechargeRecord manualSuccess(Long userId, java.math.BigDecimal amount, RechargeRecord.RechargeType type) {
        RechargeRecord record = new RechargeRecord();
        record.setUserId(userId);
        record.setAmount(amount);
        record.setType(type);
        record.setTradeNo(UUID.randomUUID().toString().replaceAll("-", ""));
        record.setStatus(RechargeRecord.RechargeStatus.SUCCESS);
        record.setRechargeDate(LocalDateTime.now());
        rechargeRecordRepository.save(record);

        userRepository.findById(userId).ifPresent(user -> {
            if (type == RechargeRecord.RechargeType.BALANCE) {
                user.setBalance(user.getBalance().add(amount));
            }
            user.setVipLevel(99);
            userRepository.save(user);
        });

        return record;
    }

    /**
     * 3. 模拟支付失败处理
     * @param tradeNo 交易流水号
     */
    @Transactional
    public void handlePaymentFailure(String tradeNo) {
        rechargeRecordRepository.findByTradeNo(tradeNo).ifPresent(record -> {
            if (record.getStatus() == RechargeRecord.RechargeStatus.PENDING) {
                record.setStatus(RechargeRecord.RechargeStatus.FAILED);
                rechargeRecordRepository.save(record);
            }
        });
    }
}
