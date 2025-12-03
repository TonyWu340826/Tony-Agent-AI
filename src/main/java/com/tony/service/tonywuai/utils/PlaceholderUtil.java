package com.tony.service.tonywuai.utils;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class PlaceholderUtil {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 从 param_schema JSON 字符串中提取所有期望的占位符名称
     */
    public static Set<String> getExpectedPlaceholders(String paramSchemaJson) throws Exception {
        if (paramSchemaJson == null || paramSchemaJson.trim().isEmpty()) {
            return Collections.emptySet();
        }

        List<ParamSchemaItem> items = objectMapper.readValue(paramSchemaJson,
                new TypeReference<List<ParamSchemaItem>>() {});

        // 将 name 转换为 {name} 格式的占位符
        return items.stream()
                .map(item -> "{" + item.getName() + "}")
                .collect(Collectors.toSet());
    }

    /**
     * 校验 LLM 返回的结果中是否包含所有期望的占位符
     * @param llmOutput LLM 返回的优化后提示词文本
     * @param expectedPlaceholders 期望的占位符集合 (如: {"{promt}", "{city}"})
     */
    public static boolean containsAllPlaceholders(String llmOutput, Set<String> expectedPlaceholders) {
        if (llmOutput == null || expectedPlaceholders.isEmpty()) return true;

        String content = extractOptimizedPromptBlock(llmOutput);

        for (String placeholder : expectedPlaceholders) {
            if (!content.contains(placeholder)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 从 LLM 完整的输出中，只提取《优化后提示词》块的内容
     * 这样做可以避免在校验时被《优化理由》中的文本干扰。
     */
    public static String extractOptimizedPromptBlock(String llmOutput) {
        if (llmOutput == null) return "";

        Pattern pattern = Pattern.compile("《优化后提示词》\\s*([^《]*)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(llmOutput);

        if (matcher.find()) {
            // 返回匹配到的提示词内容
            return matcher.group(1).trim();
        }
        return llmOutput; // 如果格式不标准，返回全部内容
    }
}
