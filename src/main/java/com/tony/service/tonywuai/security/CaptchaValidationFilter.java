package com.tony.service.tonywuai.security;

import com.tony.service.tonywuai.controller.CaptchaController;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class CaptchaValidationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if ("/api/auth/login".equals(path) && "POST".equalsIgnoreCase(request.getMethod())) {
            HttpSession session = request.getSession(false);
            String expected = session != null ? (String) session.getAttribute(CaptchaController.getSessionKey()) : null;
            String provided = request.getParameter("captcha");
            if (expected == null || provided == null || !expected.equalsIgnoreCase(provided)) {
                response.setStatus(400);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getOutputStream().write("{\"success\":false,\"message\":\"验证码错误\"}".getBytes(StandardCharsets.UTF_8));
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}

