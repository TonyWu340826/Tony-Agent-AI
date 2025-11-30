package com.tony.service.tonywuai.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * AI 工具实体类 (匹配 t_ai_tool 表结构)
 */
@Data
@Entity
@Table(name = "t_ai_tool")
@EntityListeners(AuditingEntityListener.class)
public class AITool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 工具名称 (例如: 文本摘要, 图像生成)
     */
    @Column(name = "tool_name", nullable = false, length = 100)
    private String toolName;

    /**
     * 工具描述
     */
    @Column(length = 500)
    private String description;

    /**
     * 后端API接口路径 (唯一)
     */
    @Column(name = "api_path", nullable = false, unique = true, length = 255)
    private String apiPath;

    /**
     * 工具图标或图片 URL
     */
    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    /**
     * 是否激活/启用
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * 创建时间
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;


    /**
     * 类型(1:AI工具,2:三方Agent平台,3:阅读与写作,4:文升图,5:AI商业解读,6:教育,7:AI智能SQL,8:文案与写作)
     */
    @Column(name = "type", nullable = false)
    private Integer type;

    /**
     * 是否VIP99可用 (VIP: 仅VIP99可用，NO：所有人可用)
     */
    @Column(name = "vip_alow", length = 255)
    private String vipAllow;

    /**
     * 链接方式(1: 根据 api_path 直接跳转, 2: 根据内部代码实现, 3: 根据 api_path 内嵌)
     */
    @Column(name = "link_type", length = 10)
    private String linkType;

}
