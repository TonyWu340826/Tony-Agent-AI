package com.tony.service.tonywuai.service.impl;
import com.tony.service.tonywuai.dto.UserDTO;
import com.tony.service.tonywuai.dto.UserRegisterRequest;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.repository.UserRepository;
import com.tony.service.tonywuai.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // 导入 UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    Logger logger = LoggerFactory.getLogger(this.getClass());

    // ====================== 认证相关方法 ======================

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("登录验证>>>>>>{}",username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户未找到: " + username));

        // 将数据库 User 实体转换为 Spring Security 的 UserDetails 对象
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                Collections.emptyList() // 暂时不设置权限
        );
    }

    @Override
    @Transactional
    public User registerNewUser(UserRegisterRequest request) {
        // 检查用户名是否已存在
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("用户名已被占用: " + request.getUsername());
        }

        // 检查邮箱是否已存在
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("邮箱已被注册: " + request.getEmail());
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setVipLevel(0);
        newUser.setBalance(BigDecimal.ZERO);
        newUser.setIsActive(true);

        return userRepository.save(newUser);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户未找到: " + username));
    }

    @Override
    @Transactional
    public User updateUsername(String currentUsername, String newUsername) {
        if (currentUsername == null || currentUsername.isBlank()) {
            throw new RuntimeException("当前用户名不能为空");
        }
        if (newUsername == null || newUsername.isBlank()) {
            throw new RuntimeException("新用户名不能为空");
        }

        String normalizedNewUsername = newUsername.trim();
        if (Objects.equals(currentUsername, normalizedNewUsername)) {
            return getUserByUsername(currentUsername);
        }

        if (userRepository.existsByUsername(normalizedNewUsername)) {
            throw new RuntimeException("用户名已被占用: " + normalizedNewUsername);
        }

        User user = getUserByUsername(currentUsername);
        user.setUsername(normalizedNewUsername);
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsersByIds(List<Long> userIds) {
        return userRepository.findAllById(userIds);
    }

    // ====================== Admin 管理方法 ======================

    /**
     * [Admin] 分页、模糊查询用户列表
     * 注意：这里假设您的 UserRepository 中有基于 criteria 的查询方法。
     * 实际项目中，您可能需要使用 Spring Data JPA 的 Specification 或 QueryDsl。
     * 为了简化，我们假设 UserRepository 提供了 findByUsernameContainingOrNicknameContainingOrEmailContaining 方法。
     * 如果没有，需要您在 UserRepository 中添加类似方法，或者手动实现。
     */
    @Override
    public Page<User> findUsersByCriteria(int page, int size, Optional<String> searchTerm) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (searchTerm.isPresent() && !searchTerm.get().isBlank()) {
            String term = searchTerm.get();
            // 假设 Repository 具备模糊查询能力 (或使用 JPQL @Query)
            // 实际项目中这里可能需要一个自定义查询
            return userRepository.findByUsernameContainingIgnoreCaseOrNicknameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    term, term, term, pageable
            );
        } else {
            return userRepository.findAll(pageable);
        }
    }

    /**
     * [Admin] 根据 ID 更新用户的激活状态
     */
    @Override
    @Transactional
    public User updateUserActiveStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户未找到，ID: " + userId));

        if (!user.getIsActive().equals(isActive)) {
            user.setIsActive(isActive);
            userRepository.save(user); // 确保状态更新持久化
            logger.info("Admin updated user {} status to {}", user.getUsername(), isActive ? "Active" : "Banned");
        }
        return user;
    }

    /**
     * [Admin] 删除用户 (物理删除)
     */
    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("用户未找到，ID: " + userId);
        }
        userRepository.deleteById(userId);
        logger.warn("Admin deleted user ID: {}", userId);
    }

    /**
     * [Admin] 更新用户的基本信息和会员等级
     */
    @Override
    @Transactional
    public User updateUserInfoByAdmin(UserDTO userDto) {
        User user = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new RuntimeException("用户未找到，ID: " + userDto.getId()));

        // 更新字段
        Optional.ofNullable(userDto.getNickname()).ifPresent(user::setNickname);
        Optional.ofNullable(userDto.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(userDto.getVipLevel()).ifPresent(user::setVipLevel);
        Optional.ofNullable(userDto.getIsActive()).ifPresent(user::setIsActive);
        // Balance 等其他字段按需更新

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUserPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户未找到，ID: " + userId));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}