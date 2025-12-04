package com.tony.service.tonywuai.dto.request;

public class PromptBaseRequest {


    /**
     * 参数
     */
    private String paramSchema;

    /**
     * 提示词
     * 角色：system
     */
    private String promt;

    /**
     * 用户话术
     * 角色：user
     */
    private String message;

    /**
     * 上下文
     * 角色：assistant
     */
    String context;


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
