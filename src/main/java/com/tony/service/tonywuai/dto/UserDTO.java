package com.tony.service.tonywuai.dto;
import com.tony.service.tonywuai.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 用户数据传输对象，用于Admin后台接口返回用户列表和详情。
 * 避免暴露密码哈希等敏感信息。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "用户数据传输对象")
public class UserDTO {

    @Schema(description = "用户ID")
    private Long id;
    
    @Schema(description = "用户名")
    private String username;
    
    @Schema(description = "邮箱")
    private String email;
    
    @Schema(description = "昵称")
    private String nickname;
    
    @Schema(description = "VIP等级")
    private Integer vipLevel;
    
    @Schema(description = "账户余额")
    private BigDecimal balance;
    
    @Schema(description = "是否激活")
    private Boolean isActive;
    
    @Schema(description = "注册日期")
    private LocalDateTime registrationDate;
    
    @Schema(description = "用户类型", defaultValue = "0")
    private String userType = "0";


    public static UserDTO fromEntity(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNickname(),
                user.getVipLevel(),
                user.getBalance(),
                user.getIsActive(),
                user.getRegistrationDate(),
                user.getUserType()
        );
    }
}