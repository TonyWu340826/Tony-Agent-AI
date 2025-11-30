package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.UserLoginRequest;
import com.tony.service.tonywuai.dto.UserRegisterRequest;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 用户认证控制器：处理注册和登录请求
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * 用户注册接口
     * 路径: POST /api/auth/register
     * @param request 注册请求体
     * @return 注册结果
     */
    @PostMapping("/register")
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
     * 用户登录接口 (实际登录逻辑由 Spring Security 的 formLogin 拦截器处理)
     * 路径: POST /api/auth/login
     *
     * 备注: 这里的 Controller 方法主要用于文档说明。
     * 实际的身份验证是由 SecurityConfig 中配置的 .formLogin().loginProcessingUrl("/api/auth/login") 拦截器处理的。
     * 它会在成功或失败后调用我们配置的 successHandler 或 failureHandler。
     *
     * @param request 登录请求体 (仅用于接收数据，不执行实际认证逻辑)
     * @return 登录处理结果 (由 SecurityFilterChain 中的 Handler 返回 JSON)
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest request) {
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
    public ResponseEntity<?> getCurrentUser(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }

        try {
            User user = userService.getUserByUsername(principal.getUsername());
            // 转换为 DTO 返回给前端，隐藏密码哈希等敏感信息
            Map<String, Object> userData = Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "nickname", user.getNickname(),
                    "vipLevel", user.getVipLevel(),
                    "balance", user.getBalance()
            );
            return ResponseEntity.ok(Map.of("success", true, "user", userData));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "用户不存在"));
        }
    }


    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }


}
