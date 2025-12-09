package com.tony.service.tonywuai.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 根路径控制器
 * 处理根路径访问，重定向到用户主页
 */
@Controller
public class IndexController {

    /**
     * 根路径重定向到用户主页
     * 确保未登录用户不会直接进入后台管理页面
     */
    @GetMapping("/")
    public String index() {
        return "redirect:/home.html";
    }
}
