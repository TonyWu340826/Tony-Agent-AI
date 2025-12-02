package com.tony.service.tonywuai.dto.request;


public class ModelRequest {
    String message;
    String prompt;


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
}

