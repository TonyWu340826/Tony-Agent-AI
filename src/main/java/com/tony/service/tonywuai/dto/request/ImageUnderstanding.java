package com.tony.service.tonywuai.dto.request;

import com.tony.service.tonywuai.dto.base.BaseDto;

/**
 * 图片理解
 */
public class ImageUnderstanding extends BaseDto {


    private String imageType;
    private String imageBase64;


    public ImageUnderstanding(String imageType, String imageBase64) {
        this.imageType = imageType;
        this.imageBase64 = imageBase64;
    }

    public ImageUnderstanding(String message, String role, String context, String prompt, String imageType, String imageBase64) {
        super(message, role, context, prompt);
        this.imageType = imageType;
        this.imageBase64 = imageBase64;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
}
