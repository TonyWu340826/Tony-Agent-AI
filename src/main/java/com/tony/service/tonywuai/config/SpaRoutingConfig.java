package com.tony.service.tonywuai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * SPA单页应用路由配置
 * 将所有前端路由重定向到 home.html，支持前端路由刷新
 */
@Configuration
public class SpaRoutingConfig implements WebMvcConfigurer {
    
    @Value("${temp.upload.dir:/tmp/uploads}")
    private String tempUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置静态资源处理
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/web/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // 如果请求的是API接口，不处理
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }
                        
                        // 如果请求的是Swagger相关，不处理
                        if (resourcePath.startsWith("swagger-ui") || 
                            resourcePath.startsWith("v3/api-docs") ||
                            resourcePath.equals("swagger-ui.html")) {
                            return null;
                        }
                        
                        // 如果是实际存在的文件（js, css, 图片等），直接返回
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // 如果是以下前端路由路径，返回 home.html
                        if (resourcePath.startsWith("interview") || 
                            resourcePath.startsWith("tech-learning") ||
                            resourcePath.startsWith("prompt-engineering") ||
                            resourcePath.startsWith("articles") ||
                            resourcePath.startsWith("learn") ||
                            resourcePath.startsWith("agent-chat")) {
                            return new ClassPathResource("/web/home.html");
                        }
                        
                        // 其他情况，尝试返回请求的资源
                        return requestedResource.exists() && requestedResource.isReadable() ? requestedResource : null;
                    }
                });
        
        // 添加上传文件的静态资源映射
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + tempUploadDir + "/");
    }
}