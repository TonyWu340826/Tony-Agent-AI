package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.UserLoginRequest;
import com.tony.service.tonywuai.dto.UserRegisterRequest;
import com.tony.service.tonywuai.dto.UpdateUsernameRequest;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户认证控制器：处理注册和登录请求
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "用户认证", description = "用户注册、登录及当前用户信息获取接口")
public class AuthController {

    private final UserService userService;

    /**
     * 用户注册接口
     * 路径: POST /api/auth/register
     * @param request 注册请求体
     * @return 注册结果
     */
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册接口，需要验证码")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterRequest request, jakarta.servlet.http.HttpSession session) {
        try {
            String expected = (String) session.getAttribute(com.tony.service.tonywuai.controller.CaptchaController.getSessionKey());
            if (expected == null || request.getCaptcha() == null || !expected.equalsIgnoreCase(request.getCaptcha())) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "验证码错误"));
            }
            User newUser = userService.registerNewUser(request);

            // 注册成功，返回简化后的用户信息
            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "注册成功",
                    "username", newUser.getUsername(),
                    "id", newUser.getId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            // 捕获服务层抛出的异常 (如用户名或邮箱已存在)
            Map<String, Object> errorResponse = Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }


    /**
     * 用户自助修改用户名。
     * 路径: PATCH /api/auth/user/username
     */
    @PatchMapping("/user/username")
    @Operation(summary = "修改用户名", description = "用户端设置页自助修改用户名")
    public ResponseEntity<?> updateUsername(
            @Valid @RequestBody UpdateUsernameRequest request,
            @Parameter(hidden = true) @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }

        try {
            User user = userService.updateUsername(principal.getUsername(), request.getUsername());

            // 为什么要刷新 SecurityContext：用户名作为 principal 的 key，如果不刷新会导致同一 session 下
            // 后续接口仍携带旧用户名而查询失败。
            Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
            if (currentAuth != null) {
                String password = "";
                Object authPrincipal = currentAuth.getPrincipal();
                if (authPrincipal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
                    password = userDetails.getPassword();
                }

                org.springframework.security.core.userdetails.UserDetails newPrincipal =
                        new org.springframework.security.core.userdetails.User(user.getUsername(), password, currentAuth.getAuthorities());
                Authentication newAuth = new UsernamePasswordAuthenticationToken(
                        newPrincipal,
                        currentAuth.getCredentials(),
                        currentAuth.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }

            Map<String, Object> userData = new java.util.HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("nickname", user.getNickname());
            userData.put("vipLevel", user.getVipLevel());
            userData.put("balance", user.getBalance());
            userData.put("registrationDate", user.getRegistrationDate());

            return ResponseEntity.ok(Map.of("success", true, "message", "修改成功", "user", userData));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 用户登录接口 (实际登录逻辑由 Spring Security 的 formLogin 拦截器处理)
     * 路径: POST /api/auth/login
     *
     * 备注: 这里的 Controller 方法主要用于文档说明。
     * 实际的身份验证是由 SecurityConfig 中配置的 .formLogin().loginProcessingUrl("/api/auth/login") 拦截器处理的。
     * 它会在成功或失败后调用我们配置的 successHandler 或 failureHandler。
     *
     * @param： request 登录请求体 (仅用于接收数据，不执行实际认证逻辑)
     * @return 登录处理结果 (由 SecurityFilterChain 中的 Handler 返回 JSON)
     */
    @PostMapping(value = "/login", consumes = "application/x-www-form-urlencoded")
    @Operation(summary = "用户登录", description = "用户登录接口 (实际由Spring Security处理)，使用表单格式提交")
    public ResponseEntity<?> loginUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                content = @io.swagger.v3.oas.annotations.media.Content(
                    mediaType = "application/x-www-form-urlencoded"
                )
            )
            @RequestParam(required = true) String username,
            @RequestParam(required = true) String password,
            @RequestParam(required = true) String captcha,
            @RequestParam(required = false, defaultValue = "0") String userType
    ) {
        // 这个方法在 Spring Security 拦截器前不会执行到，
        // 这里的返回值只是为了 API 文档和清晰度。
        return ResponseEntity.ok(Map.of("success", true, "message", "登录请求已提交到 Spring Security 处理"));
    }

    /**
     * 获取当前登录用户信息接口
     * 路径: GET /api/auth/user
     * @param principal Spring Security 注入的认证主体
     * @return 用户信息 DTO
     */
    @GetMapping("/user")
    @Operation(summary = "获取当前用户", description = "获取当前已登录用户的详细信息")
    public ResponseEntity<?> getCurrentUser(
            @Parameter(hidden = true) @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }

        try {
            User user = userService.getUserByUsername(principal.getUsername());
            // 转换为 DTO 返回给前端，隐藏密码哈希等敏感信息
            Map<String, Object> userData = new java.util.HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("nickname", user.getNickname());
            userData.put("vipLevel", user.getVipLevel());
            userData.put("balance", user.getBalance());
            userData.put("registrationDate", user.getRegistrationDate());
            
            return ResponseEntity.ok(Map.of("success", true, "user", userData));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "用户不存在"));
        }
    }


    @GetMapping("/hello")
    @Operation(summary = "Hello测试", description = "简单的Hello World测试接口")
    public String hello() {
        return "Hello, World!";
    }


}
