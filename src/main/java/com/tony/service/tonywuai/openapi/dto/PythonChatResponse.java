package com.tony.service.tonywuai.openapi.dto;

import lombok.Data;

@Data
public class PythonChatResponse<T> {
    private String response;
    private String message;
    private String mail;
    private String type;
    private String code;
    private T data;

}

