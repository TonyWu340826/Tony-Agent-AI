//package com.tony.service.tonywuai.config;
//import com.tony.service.tonywuai.entity.User;
//import com.tony.service.tonywuai.repository.UserRepository;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import java.math.BigDecimal;
//
///**
// * 数据库连接和初始化测试配置
// */
//@Configuration
//public class DatabaseInitializer {
//
//    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);
//
//    @Bean
//    public CommandLineRunner initDatabase(UserRepository userRepository) {
//        return args -> {
//            log.info("--- 数据库连接测试和初始化开始 ---");
//
//            // 1. 检查数据库连接是否正常
//            try {
//                long userCount = userRepository.count();
//                log.info("数据库连接成功! t_user 表中当前有 {} 条记录。", userCount);
//            } catch (Exception e) {
//                log.error("数据库连接或表映射失败! 请检查 application.yml 配置和 MySQL 服务状态。", e);
//                // 抛出异常，阻止应用启动，直到数据库问题解决
//                throw new RuntimeException("数据库初始化失败", e);
//            }
//
//            // 2. 插入一个测试用户（如果不存在）
//            if (userRepository.findByUsername("test_user").isEmpty()) {
//                User testUser = new User();
//                testUser.setUsername("test_user");
//                // 实际项目中密码需要加密，这里为了测试方便用明文标识
//                testUser.setPasswordHash("plaintext_password_for_test");
//                testUser.setEmail("test@example.com");
//                testUser.setNickname("测试用户");
//                testUser.setBalance(new BigDecimal("100.50"));
//
//                User savedUser = userRepository.save(testUser);
//                log.info("成功插入测试用户: ID={}", savedUser.getId());
//            } else {
//                log.info("测试用户 'test_user' 已存在，跳过插入。");
//            }
//
//            log.info("--- 数据库连接测试和初始化完成 ---");
//        };
//    }
//}