package com.tony.service.tonywuai.dto.base;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "大模型请求基础类")
public class BaseDto {

    @Schema(description = "用户需求")
    String message;

    @Schema(description = "提示词")
    String prompt;

    @Schema(description = "上下文")
    String context;

    @Schema(description = "角色")
    String role;

    public BaseDto() {
    }

    public BaseDto(String message, String role, String context, String prompt) {
        this.message = message;
        this.role = role;
        this.context = context;
        this.prompt = prompt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}
