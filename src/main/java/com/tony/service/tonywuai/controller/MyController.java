package com.tony.service.tonywuai.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author: yunshan
 * @create: 2023-11-05 11:12
 * @desc:
 */
@RestController
@RequestMapping("/my")
@Tag(name = "测试接口", description = "简单的测试接口")
public class MyController {
    Logger logger = LoggerFactory.getLogger(MyController.class);



    @GetMapping("/hello")
    @Operation(summary = "Hello World", description = "返回 Hello World 字符串")
    public String hello() {
        return "Hello, World!";
    }



}