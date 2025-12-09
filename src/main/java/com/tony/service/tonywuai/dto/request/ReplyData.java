package com.tony.service.tonywuai.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "回复数据")
public class ReplyData {
    @Schema(description = "回复内容")
    private String reply;

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}
