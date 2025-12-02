package com.tony.service.tonywuai.dto.request;


/**
 * AI用例的入参
 */
public class CozeWorkFlowRequest {

    /**
     * autoCase： 生成用例
     * caseCheck： 检查用例
     */
    private String type;

    /**
     * 收件邮箱地址
     */
    private String mail;


    /**
     *  autoCase 专用，需求在飞书的标识，有了input1就不需要传
     */
    private String documentId;

    /**
     * autoCase 专用。输入需求
     */
    private String input;

    /**
     * caseCheck 专用 用例在飞书的标识
     */
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
