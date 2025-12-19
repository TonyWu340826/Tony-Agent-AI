package com.tony.service.tonywuai.service;
import com.tony.service.tonywuai.dto.UserDTO;
import com.tony.service.tonywuai.dto.UserRegisterRequest;
import com.tony.service.tonywuai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

    /**
     * 注册新用户
     * @param request 注册请求 DTO
     * @return 注册成功的用户实体
     * @throws RuntimeException 如果用户名或邮箱已存在
     */
    User registerNewUser(UserRegisterRequest request);

    /**
     * 根据用户名获取用户实体
     * @param username 用户名
     * @return 用户实体
     */
    User getUserByUsername(String username);

    /**
     * 更新用户的登录用户名。
     *
     * <p>用于用户端“设置”页自助修改用户名。该方法会负责做用户名唯一性校验。
     *
     * @param currentUsername 当前登录用户名（旧用户名）
     * @param newUsername 新用户名
     * @return 更新后的用户实体
     */
    User updateUsername(String currentUsername, String newUsername);

    /**
     * 根据 ID 列表批量获取用户实体
     * @param userIds 用户 ID 列表
     * @return 用户实体列表
     */
    List<User> getAllUsersByIds(List<Long> userIds);

    // --- 新增 Admin 管理功能接口 ---

    /**
     * [Admin] 分页、模糊查询用户列表
     * @param page 页码 (从0开始)
     * @param size 每页大小
     * @param searchTerm 搜索关键词 (可搜索用户名、昵称、邮箱)
     * @return 分页的用户实体
     */
    Page<User> findUsersByCriteria(int page, int size, Optional<String> searchTerm);

    /**
     * [Admin] 根据 ID 更新用户的激活状态
     * @param userId 待更新的用户 ID
     * @param isActive 新的激活状态
     * @return 更新后的用户实体
     * @throws RuntimeException 如果用户未找到
     */
    User updateUserActiveStatus(Long userId, Boolean isActive);

    /**
     * [Admin] 删除用户 (逻辑删除或物理删除，此处使用物理删除)
     * @param userId 待删除的用户 ID
     */
    void deleteUser(Long userId);

    /**
     * [Admin] 更新用户的基本信息和会员等级 (例如：修改昵称、邮箱、会员等级)
     * @param userDto 包含待更新信息的用户 DTO
     * @return 更新后的用户实体
     */
    User updateUserInfoByAdmin(UserDTO userDto);
}