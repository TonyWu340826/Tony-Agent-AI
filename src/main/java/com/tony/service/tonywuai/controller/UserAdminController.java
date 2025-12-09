package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.UserDTO;
import com.tony.service.tonywuai.dto.UserRegisterRequest;
import com.tony.service.tonywuai.dto.UserUpdateStatusRequest;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 后台管理用户接口。
 * 假设这个控制器需要Admin角色权限才能访问。
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "用户管理(后台)", description = "管理员用户管理接口")
// 假设 Spring Security 已配置，只有具有 ADMIN 角色的用户才能访问这些接口
// @PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserService userService;

    /**
     * [GET] /api/admin/users
     * 获取用户列表（支持分页和搜索）
     *
     * @param page 页码 (默认0)
     * @param size 每页数量 (默认10)
     * @param search 搜索关键词 (可选)
     * @return 分页的用户DTO列表
     */
    @GetMapping
    @Operation(summary = "获取用户列表", description = "管理员分页查询用户列表")
    public ResponseEntity<Page<UserDTO>> listUsers(
            @Parameter(description = "页码 (默认0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量 (默认10)") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "搜索关键词") @RequestParam Optional<String> search) {

        Page<User> userPage = userService.findUsersByCriteria(page, size, search);

        Page<UserDTO> userDtoPage = userPage.map(UserDTO::fromEntity);

        return ResponseEntity.ok(userDtoPage);
    }

    /**
     * [POST] /api/admin/users/add
     * 后台新增用户（复用注册逻辑）
     *
     * @param request 注册/新增请求 DTO
     * @return 新增的用户DTO
     */
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "新增用户", description = "管理员新增用户")
    public ResponseEntity<UserDTO> addNewUser(@Parameter(description = "注册请求信息") @Valid @RequestBody UserRegisterRequest request) {
        User newUser = userService.registerNewUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDTO.fromEntity(newUser));
    }

    /**
     * [PUT] /api/admin/users/status
     * 更新用户激活状态（禁用/激活）
     *
     * @param request 状态更新请求 DTO
     * @return 更新后的用户DTO
     */
    @PutMapping("/status")
    @Operation(summary = "更新用户状态", description = "管理员更新用户激活状态")
    public ResponseEntity<UserDTO> updateStatus(@Parameter(description = "状态更新请求") @Valid @RequestBody UserUpdateStatusRequest request) {
        User updatedUser = userService.updateUserActiveStatus(request.getUserId(), request.getIsActive());
        return ResponseEntity.ok(UserDTO.fromEntity(updatedUser));
    }

    /**
     * [PUT] /api/admin/users/{userId}
     * 管理员修改用户信息（昵称、邮箱、会员等级等）
     *
     * @param userId 待修改的用户ID
     * @param userDto 包含更新信息的DTO
     * @return 更新后的用户DTO
     */
    @PutMapping("/{userId}")
    @Operation(summary = "修改用户信息", description = "管理员修改用户信息")
    public ResponseEntity<UserDTO> updateUserInfo(
            @Parameter(description = "用户ID") @PathVariable Long userId,
            @Parameter(description = "用户信息") @RequestBody UserDTO userDto) {
        // 确保ID匹配，防止前端误传
        userDto.setId(userId);
        User updatedUser = userService.updateUserInfoByAdmin(userDto);
        return ResponseEntity.ok(UserDTO.fromEntity(updatedUser));
    }

    /**
     * [DELETE] /api/admin/users/{userId}
     * 删除用户
     *
     * @param userId 待删除的用户 ID
     * @return 无内容响应
     */
    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "删除用户", description = "管理员删除用户")
    public ResponseEntity<Void> deleteUser(@Parameter(description = "用户ID") @PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}