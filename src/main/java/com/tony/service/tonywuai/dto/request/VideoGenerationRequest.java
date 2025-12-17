package com.tony.service.tonywuai.dto.request;

import com.tony.service.tonywuai.dto.base.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 *         """
 *         文生视频：根据文本提示词生成视频（同步调用，直接返回结果）
 *
 *         使用VideoSynthesis.call接口调用文生视频模型，
 *         根据文本提示词生成相应的视频内容，支持音频、水印等高级功能。
 *
 *         支持的文生视频模型列表：
 *         1. wanx2.1-t2v-plus（推荐）
 *            - 类型：专业版文生视频模型
 *            - 特点：质量高，稳定性好
 *            - 分辨率：支持多种分辨率
 *            - 时长：通常为5秒
 *
 *         2. wanx2.1-t2v-turbo
 *            - 类型：极速版文生视频模型
 *            - 特点：生成速度快
 *            - 分辨率：支持多种分辨率
 *            - 时长：通常为5秒
 *
 *         3. wanx-txt2video-pro
 *            - 类型：文生视频专业版
 *            - 特点：综合性能优秀
 *            - 分辨率：支持多种分辨率
 *            - 时长：根据具体配置而定
 *
 *         注意：不同模型支持的参数可能略有差异，请根据具体模型调整参数。
 *
 *         Args:
 *             prompt (str): 正向提示词，描述希望生成的视频内容
 *             negative_prompt (str): 反向提示词，描述不希望出现的内容
 *             size (str): 视频分辨率，如 "1280*720"、"832*480" 等
 *             duration (int): 视频时长（秒），可选值通常为5或10
 *             model (str): 模型名称，默认使用 wanx2.1-t2v-plus
 *             audio (bool): 是否启用音频（仅适用于支持音频的模型版本）
 *             audio_url (str): 自定义音频文件URL（可选）
 *             prompt_extend (bool): 是否启用自动扩写提示词
 *             watermark (bool): 是否添加阿里云水印
 *             seed (int): 随机种子，用于控制生成结果的一致性
 *
 *         Returns:
 *             Optional[dict]: 成功时返回包含视频URL等完整信息的字典，失败返回None
 *         """
 */
@Schema(description = "文生视频")
public class VideoGenerationRequest extends BaseDto {


    /**
     * 低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良等
     */
    @Schema(description = "负面提示词")
    String negativePrompt;


    /**
     * 分辨率
     * 1920*1080
     * 1080*1920
     * 1440*1440
     * 1632*1248
     * 1248*1632
     */
    @Schema(description = "视频分辨率")
    private String size;

    /**
     * 5S
     * 10s
     * 15s
     */
    @Schema(description = "视频时长（秒）")
    private int duration;

    @Schema(description = "是否启用音频")
    private Boolean audio;

    @Schema(description = "自定义音频文件URL")
    private String audioUrl;

    @Schema(description = "是否添加水印")
    private Boolean watermark;

    // 添加提示词字段
    @Schema(description = "正向提示词")
    private String prompt;

    public VideoGenerationRequest() {
    }

    public VideoGenerationRequest(String negativePrompt, String size, int duration, Boolean audio, String audioUrl, Boolean watermark) {
        this.negativePrompt = negativePrompt;
        this.size = size;
        this.duration = duration;
        this.audio = audio;
        this.audioUrl = audioUrl;
        this.watermark = watermark;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
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

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public Boolean getAudio() {
        return audio;
    }

    public void setAudio(Boolean audio) {
        this.audio = audio;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Boolean getWatermark() {
        return watermark;
    }

    public void setWatermark(Boolean watermark) {
        this.watermark = watermark;
    }
}