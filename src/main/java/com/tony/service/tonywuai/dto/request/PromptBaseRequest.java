package com.tony.service.tonywuai.dto.request;

public class PromptBaseRequest {

    private String paramSchema;
    private String promt;
    private String roleType;

    public PromptBaseRequest() {
    }

    public PromptBaseRequest(String paramSchema, String promt, String roleType) {
        this.paramSchema = paramSchema;
        this.promt = promt;
        this.roleType = roleType;
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
