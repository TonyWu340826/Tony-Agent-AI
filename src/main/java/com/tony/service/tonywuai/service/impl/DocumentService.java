package com.tony.service.tonywuai.service.impl;
import com.tony.service.tonywuai.openapi.MilvusOpenAiClient;
import com.tony.service.tonywuai.openapi.PythonOpenApiClient;
import com.tony.service.tonywuai.openapi.dto.DocChatRequest;
import com.tony.service.tonywuai.openapi.dto.DocSearchHit;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description good luck
 * @Author yunshan
 * @Version V1.0.0
 * @Since 1.0
 * @Date 2026/1/7
 */
@Service
public class DocumentService {

    Logger logger = LoggerFactory.getLogger(this.getClass());


    @Resource
    private  PythonOpenApiClient pythonOpenApiClient;

    @Resource
    private  MilvusOpenAiClient milvusOpenAiClient;


    /**
     * 搜索/对话搜索/对话（转发给第三方程序）。
     * @param request
     * @return
     * @throws Exception
     */
    public String docChat(DocChatRequest request) throws Exception {
        String question = validateAndGetQuestion(request);
        List<DocSearchHit> hits = fetchHits(request);
        String context = buildContextFromHits(hits, 10, 6000);
        String prompt = buildSystemPrompt();
        return callLlmForAnswer(question, prompt, context);
    }


    private String validateAndGetQuestion(DocChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("message不能为空");
        }
        return request.getMessage().trim();
    }


    private List<DocSearchHit> fetchHits(DocChatRequest request) throws Exception {
        List<DocSearchHit> hits = milvusOpenAiClient.docChat(request);
        return hits != null ? hits : new ArrayList<>();
    }


    private String buildContextFromHits(List<DocSearchHit> hits, int topN, int maxChars) {
        if (hits == null || hits.isEmpty() || topN <= 0 || maxChars <= 0) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        int used = 0;

        int max = Math.min(topN, hits.size());
        int idx = 1;
        for (int i = 0; i < max; i++) {
            DocSearchHit h = hits.get(i);
            if (h == null || h.getContent() == null || h.getContent().trim().isEmpty()) {
                continue;
            }

            String content = h.getContent().trim();
            String header = "[片段" + idx + "]" +
                    (h.getSection() != null ? " 章节:" + h.getSection() : "") +
                    (h.getChunkIndex() != null ? " chunkIndex:" + h.getChunkIndex() : "") +
                    (h.getScore() != null ? " score:" + h.getScore() : "");

            String piece = header + "\n" + content + "\n\n";
            if (used + piece.length() > maxChars) {
                int remain = maxChars - used;
                if (remain <= 0) {
                    break;
                }
                sb.append(piece, 0, Math.min(piece.length(), remain));
                break;
            }

            sb.append(piece);
            used += piece.length();
            idx++;
        }

        return sb.length() == 0 ? null : sb.toString();
    }


    private String buildSystemPrompt() {
        return "你是一个严谨的企业知识库问答助手。\n" +
                "你会收到：用户问题 + 一组【检索片段】（来自企业知识库）。\n" +
                "请按照以下规则回答：\n" +
                "1. 只能使用【检索片段】中的信息作答；不得引入外部常识、不得编造。\n" +
                "2. 如果片段不足以回答，必须明确回答：知识库未检索到足够信息，并说明缺少哪些信息。\n" +
                "3. 对关键结论给出引用，引用格式为：[片段1]、[片段2]。\n" +
                "4. 输出结构固定为：\n" +
                "- 结论：...\n" +
                "- 依据：...（带引用）\n"
                ;
    }


    private String callLlmForAnswer(String question, String prompt, String context) throws Exception {
        String finalPrompt = prompt;
        // deepSeekChat 的第三个参数在本场景不使用；把检索上下文拼进 system prompt 里传给模型。
        if (context != null && !context.isBlank()) {
            finalPrompt = finalPrompt + "\n\n" +
                    "【检索片段】\n" +
                    context;
        }
        String llmResp = pythonOpenApiClient.deepSeekChat(question, finalPrompt, null);
        return llmResp == null ? "" : llmResp;
    }









}






