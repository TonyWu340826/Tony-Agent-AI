package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.RechargeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 充值记录数据访问接口
 */
public interface RechargeRecordRepository extends JpaRepository<RechargeRecord, Long> {

    /**
     * 根据交易流水号查找记录
     * @param tradeNo 交易流水号
     * @return 充值记录 Optional
     */
    Optional<RechargeRecord> findByTradeNo(String tradeNo);

    /**
     * 按用户统计是否存在充值记录
     */
    long countByUserId(Long userId);

    /**
     * 全量查询，后端内存分页
     */
    java.util.List<RechargeRecord> findAllByOrderByRechargeDateDesc();

    /**
     * 按用户查询充值记录
     */
    java.util.List<RechargeRecord> findAllByUserIdOrderByRechargeDateDesc(Long userId);
}
