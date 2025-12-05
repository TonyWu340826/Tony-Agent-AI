package com.tony.service.tonywuai.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 数据库表 t_user 对应的实体类
 * 用于实现用户登录、注册、会员和余额管理
 */
@Data
@Entity
@Table(name = "t_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 登录用户名 */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** 用户邮箱 */
    @Column(unique = true, length = 100)
    private String email;

    /** 密码的哈希值，需要使用 Spring Security 加密 */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /** 用户昵称 */
    @Column(length = 50)
    private String nickname;

    /** 会员等级 (0: 普通用户, 1: VIP1, ...) */
    @Column(name = "vip_level", nullable = false)
    private Integer vipLevel = 0;

    /** 账户余额/积分 (用于AI工具消耗) */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    /** 账户是否激活 */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /** 用户类型(0:PC用户,1:后管用户,3:超级用户) */
    @Column(name = "user_type")
    private String userType = "0";

    /** dify信息，是一个json结构 */
    @Column(name = "dify_desc")
    private String difyDesc = "0";

    /** 注册时间 */
    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();

    /**
     * 在对象持久化前自动设置注册时间
     */
    @PrePersist
    protected void onCreate() {
        this.registrationDate = LocalDateTime.now();
        if (this.balance == null) {
            this.balance = BigDecimal.ZERO;
        }
        if (this.vipLevel == null) {
            this.vipLevel = 0;
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
    }
}