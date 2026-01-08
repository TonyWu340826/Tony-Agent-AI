package com.tony.service.tonywuai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.tony.service.tonywuai.security.CaptchaValidationFilter;

/**
 * Spring Security 配置类
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 配置密码编码器
     * 使用 BCryptPasswordEncoder 进行密码哈希加密
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 配置安全过滤链
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF，简化前后端交互
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // 用户自助修改用户名需要登录态
                        .requestMatchers(HttpMethod.PATCH, "/api/auth/user/username").authenticated()
                        // 允许匿名访问 /api/auth/** (注册, 登录处理, 获取用户信息)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 允许匿名访问向量接口（文档切分上传）
                        .requestMatchers(HttpMethod.POST, "/api/embedding/**").permitAll()
                        // 允许匿名访问向量接口（知识库管理）
                        .requestMatchers(HttpMethod.POST, "/api/document/**").permitAll()

                        // 允许匿名访问文章的 GET 请求 (文章列表和详情)
                        .requestMatchers(HttpMethod.GET, "/api/articles").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()

                        // 允许匿名访问静态资源和页面
                        .requestMatchers("/", "/home.html", "/index.html").permitAll()  // 根路径、用户主页、后台管理页面
                        .requestMatchers("/assets/**", "/favicon.ico", "/js/**", "/image/**", "/web/**", "/tools/**", "/css/**").permitAll()
                        
                        // 后台管理API需要认证（通过API来保护后台功能）
                        .requestMatchers("/api/admin/**", "/api/interview/admin/**", "/api/*/admin/**").authenticated()
                        
                        // 允许匿名访问所有非 API 前端路由（SPA刷新支持）
                        .requestMatchers(
                            request -> {
                                String path = request.getRequestURI();
                                // 排除 API 接口
                                return !path.startsWith("/api/") &&
                                       !path.startsWith("/swagger-ui") &&
                                       !path.startsWith("/v3/api-docs");
                            }
                        ).permitAll()

                        // 允许匿名访问 AI 工具激活列表（用户端）
                        .requestMatchers(HttpMethod.GET, "/api/tools/active").permitAll()

                        // 允许匿名访问分类树与列表（用户端展示分类）
                        .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                        // 允许匿名访问面试题目接口
                        .requestMatchers(HttpMethod.GET, "/api/interview/items").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/interview/items/**").permitAll()

                        // 允许匿名访问开放接口
                        .requestMatchers(HttpMethod.GET, "/api/open/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/open/**").permitAll()

                        // 允许匿名访问工作流接口
                        .requestMatchers(HttpMethod.POST, "/api/workFlow/**").permitAll()

                        // 访问日志放行，留言需登录
                        .requestMatchers("/api/system/messages").authenticated()
                        .requestMatchers("/api/visit/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/captcha/**").permitAll()

                        // 考试接口公开
                        .requestMatchers(HttpMethod.GET, "/api/exams/**").permitAll()

                        // Swagger / OpenAPI 文档免登录访问
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // 其他请求需要认证（仅 /api/admin/** 等后台接口）
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new CaptchaValidationFilter(), UsernamePasswordAuthenticationFilter.class)
                // 配置表单登录
                .formLogin(form -> form
                        .loginPage("/index.html")  // 登录页面路径
                        .loginProcessingUrl("/api/auth/login")  // 登录处理URL
                        .successHandler((request, response, authentication) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"success\": true, \"message\": \"登录成功\"}");
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(401);
                            response.getWriter().write("{\"success\": false, \"message\": \"用户名或密码错误\"}");
                        })
                        .permitAll()
                )

                // 配置登出
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"success\": true, \"message\": \"登出成功\"}");
                        })
                        .permitAll()
                );

        return http.build();
    }
}
