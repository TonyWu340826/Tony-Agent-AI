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
                        // 允许匿名访问 /api/auth/** (注册, 登录处理, 获取用户信息)
                        .requestMatchers("/api/auth/**").permitAll()

                        // 允许匿名访问文章的 GET 请求 (文章列表和详情)
                        .requestMatchers(HttpMethod.GET, "/api/articles").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()

                        // 允许匿名访问静态资源
                        .requestMatchers("/", "/index.html", "/home.html", "/assets/**", "/favicon.ico", "/js/**", "/image/**", "/web/**", "/tools/**", "/css/**", "/api/interview/items**", "/api/articles**", "/api/exams/**").permitAll()

                        // 允许匿名访问 AI 工具激活列表（用户端）
                        .requestMatchers(HttpMethod.GET, "/api/tools/active").permitAll()

                        // 允许匿名访问分类树与列表（用户端展示分类）
                        .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/open/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/open/**").permitAll()

                        // 访问日志放行，留言需登录
                        .requestMatchers("/api/system/messages").authenticated()
                        .requestMatchers("/api/visit/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/captcha/**").permitAll()

                        // 其他请求需要认证
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new CaptchaValidationFilter(), UsernamePasswordAuthenticationFilter.class)
                // 配置表单登录
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
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
