package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * AI用例的入参
 */
@Schema(description = "Coze工作流请求")
public class CozeWorkFlowRequest {

    @Schema(description = "请求类型:autoCase(生成用例)|caseCheck(检查用例)")
    private String type;

    @Schema(description = "收件邮箱地址")
    private String mail;

    @Schema(description = "需求在飞书的标识,autoCase专用")
    private String documentId;

    @Schema(description = "输入需求,autoCase专用")
    private String input;

    @Schema(description = "用例在飞书的标识,caseCheck专用")
    private String caseToken;

    public CozeWorkFlowRequest() {
    }

    public CozeWorkFlowRequest(String type, String mail, String documentId, String input, String caseToken) {
        this.type = type;
        this.mail = mail;
        this.documentId = documentId;
        this.input = input;
        this.caseToken = caseToken;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getCaseToken() {
        return caseToken;
    }

    public void setCaseToken(String caseToken) {
        this.caseToken = caseToken;
    }
}
