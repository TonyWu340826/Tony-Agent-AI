package com.tony.service.tonywuai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户充值和会员购买记录表实体
 */
@Data
@Entity
@Table(name = "t_recharge_record")
public class RechargeRecord {

    public enum RechargeType {
        BALANCE, // 余额充值
        VIP      // VIP 购买
    }

    public enum RechargeStatus {
        PENDING, // 待支付
        SUCCESS, // 支付成功
        FAILED   // 支付失败
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 用户ID */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 充值金额 */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /** 充值类型 (余额或VIP) */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private RechargeType type;

    /** 交易状态 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RechargeStatus status = RechargeStatus.PENDING;

    /** 交易流水号 (唯一) */
    @Column(name = "trade_no", unique = true, nullable = false, length = 100)
    private String tradeNo;

    /** 充值时间 */
    @Column(name = "recharge_date", updatable = false, nullable = false)
    private LocalDateTime rechargeDate = LocalDateTime.now();
}