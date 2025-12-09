package com.tony.service.tonywuai.dto.request;

import com.tony.service.tonywuai.dto.base.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(description = "文生图")
public class AliyunCreateImage extends BaseDto {
    /**
     * 低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良等
     */
    @Schema(description = "负面提示词")
    String negativePrompt;


    @Schema(description = "图片大小")
    private String size = "1328*1328";

    public AliyunCreateImage() {
    }

    public AliyunCreateImage(String negativePrompt, String size) {
        this.negativePrompt = negativePrompt;
        this.size = size;
    }


    public AliyunCreateImage(String message, String role, String context, String prompt, String negativePrompt) {
        super(message, role, context, prompt);
        this.negativePrompt = negativePrompt;
    }

    public String getNegativePrompt() {
        return negativePrompt;
    }

    public void setNegativePrompt(String negativePrompt) {
        this.negativePrompt = negativePrompt;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
}
