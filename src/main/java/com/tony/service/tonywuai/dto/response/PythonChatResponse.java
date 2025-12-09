package com.tony.service.tonywuai.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Python聊天响应")
public class PythonChatResponse<T> {
    @Schema(description = "响应内容")
    private String response;
    
    @Schema(description = "消息")
    private String message;
    
    @Schema(description = "邮箱地址")
    private String mail;
    
    @Schema(description = "类型")
    private String type;
    
    @Schema(description = "响应代码")
    private String code;
    
    @Schema(description = "响应数据")
    private T data;
}
