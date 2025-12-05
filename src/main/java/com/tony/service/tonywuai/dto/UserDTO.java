package com.tony.service.tonywuai.dto;
import com.tony.service.tonywuai.entity.User;
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
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String nickname;
    private Integer vipLevel;
    private BigDecimal balance;
    private Boolean isActive;
    private LocalDateTime registrationDate;
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
