package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "提示词基础请求")
public class PromptBaseRequest {

    @Schema(description = "参数模式")
    private String paramSchema;

    @Schema(description = "提示词,角色:system")
    private String promt;

    @Schema(description = "用户话术,角色:user")
    private String message;

    @Schema(description = "上下文,角色:assistant")
    String context;

    @Schema(description = "角色类型")
    private String roleType;

    public PromptBaseRequest() {
    }

    public PromptBaseRequest(String paramSchema, String promt, String message, String context, String roleType) {
        this.paramSchema = paramSchema;
        this.promt = promt;
        this.message = message;
        this.context = context;
        this.roleType = roleType;
    }

    public PromptBaseRequest(String paramSchema, String promt, String roleType) {
        this.paramSchema = paramSchema;
        this.promt = promt;
        this.roleType = roleType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public String getParamSchema() {
        return paramSchema;
    }

    public void setParamSchema(String paramSchema) {
        this.paramSchema = paramSchema;
    }

    public String getPromt() {
        return promt;
    }

    public void setPromt(String promt) {
        this.promt = promt;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }
}
