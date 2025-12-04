package com.tony.service.tonywuai.dto.request;


public class ModelRequest {

    /**
     * 用户的对话
     * 角色：user
     */
    String message;

    /**
     * 提示词
     * 角色：system
     */
    String prompt;

    /**
     * 上下文
     * 角色：assistant
     */
    String context;





    public ModelRequest() {
    }

    public ModelRequest(String message, String prompt) {
        this.message = message;
        this.prompt = prompt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}

