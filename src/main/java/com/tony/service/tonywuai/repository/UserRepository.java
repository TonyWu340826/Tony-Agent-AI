package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * t_user 表的数据访问层接口
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    /**
     * 根据用户名查询用户，用于登录和注册检查
     */
    Optional<User> findByUsername(String username);

    /**
     * 判断用户名是否存在。
     *
     * <p>用于用户自助修改用户名时做唯一性校验。
     */
    boolean existsByUsername(String username);

    /**
     * 根据邮箱查询用户，用于注册检查
     */
    Optional<User> findByEmail(String email);

    // JpaRepository 已经提供了 findAllById 用于批量查询，无需额外声明

    // --- 新增 Admin 模糊搜索方法 ---
    Page<User> findByUsernameContainingIgnoreCaseOrNicknameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String nickname, String email, Pageable pageable
    );

}