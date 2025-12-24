// package com.tony.service.tonywuai.config;

// import com.tony.service.tonywuai.entity.AITool;
// import com.tony.service.tonywuai.repository.AIToolRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.transaction.annotation.Transactional;

// import java.util.Optional;

// /**
//  * AI工具初始化配置类
//  * 用于初始化系统所需的默认AI工具
//  */
// @Configuration
// public class AIToolsInitializer {

//     private static final Logger log = LoggerFactory.getLogger(AIToolsInitializer.class);

//     @Bean
//     @Transactional
//     public CommandLineRunner initAITools(AIToolRepository aiToolRepository) {
//         return args -> {
//             log.info("--- AI工具初始化开始 ---");

//             // 初始化文字生成视频工具 (ID=17)
//             initTextToVideoTool(aiToolRepository);

//             log.info("--- AI工具初始化完成 ---");
//         };
//     }

//     /**
//      * 初始化文字生成视频工具
//      */
//     private void initTextToVideoTool(AIToolRepository aiToolRepository) {
//         // 检查ID为17的工具是否已存在
//         Optional<AITool> existingTool = aiToolRepository.findById(17L);
        
//         if (existingTool.isPresent()) {
//             log.info("文字生成视频工具(ID=17)已存在，跳过初始化。");
//             return;
//         }

//         // 创建文字生成视频工具
//         AITool textToVideoTool = new AITool();
//         textToVideoTool.setId(17L);  // 设置固定ID
//         textToVideoTool.setToolName("文字生成视频");
//         textToVideoTool.setDescription("根据文字描述生成视频内容，支持多种模型和参数配置");
//         textToVideoTool.setApiPath("1117-text_video-tools-management.js");
//         textToVideoTool.setIconUrl("");  // 可以设置一个合适的图标URL
//         textToVideoTool.setIsActive(true);
//         textToVideoTool.setType(2);  // 三方Agent平台
//         textToVideoTool.setVipAllow("NO");  // 所有人可用，可根据需要改为"VIP"
//         textToVideoTool.setLinkType("2");  // 内部实现

//         // 保存工具
//         try {
//             AITool savedTool = aiToolRepository.save(textToVideoTool);
//             log.info("成功初始化文字生成视频工具: ID={}, 名称={}", savedTool.getId(), savedTool.getToolName());
//         } catch (Exception e) {
//             log.error("初始化文字生成视频工具失败", e);
//         }
//     }
// }