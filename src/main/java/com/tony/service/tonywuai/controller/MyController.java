package com.tony.service.tonywuai.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author: yunshan
 * @create: 2023-11-05 11:12
 * @desc:
 */
@RestController
@RequestMapping("/my")
public class MyController {
    Logger logger = LoggerFactory.getLogger(MyController.class);



    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }



}