package com.tony.service.tonywuai.controller;

import com.alibaba.fastjson.JSON;
import com.tony.service.tonywuai.dto.request.*;
import com.tony.service.tonywuai.openapi.PythonOpenApiClient;
import com.tony.service.tonywuai.utils.PlaceholderUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.tony.service.tonywuai.com.ComStatus.TYPE_AUTO_CASE;

@RestController
@RequestMapping("/api/open")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "OpenAPI 聚合服务", description = "提供对话、SQL生成、考试分析、工作流等AI能力")
public class OpenApiController {

    private final PythonOpenApiClient pythonOpenApiClient;
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/chat")
    @Operation(summary = "基础对话", description = "简单的问答对话接口")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        String prompt = body != null ? String.valueOf(body.getOrDefault("prompt", "")).trim() : "";
        if (prompt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "prompt required"));
        }
        try {
            String resp = pythonOpenApiClient.chat(prompt);
            return ResponseEntity.ok(Map.of("response", resp == null ? "" : resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }

    @PostMapping("/sql/dba")
    @Operation(summary = "SQL生成助手", description = "根据表结构和需求生成SQL语句")
    public ResponseEntity<?> sqlDba(@RequestBody Map<String, Object> body) {
        logger.info("开始调用AI生成SQL-------------------------------");
        try {
            String userPrompt = body != null ? String.valueOf(body.getOrDefault("user_prompt", "")).trim() : "";
            List<String> selectedTables = body != null && body.get("selected_tables") instanceof List
                    ? ((List<?>) body.get("selected_tables")).stream().map(String::valueOf).collect(Collectors.toList())
                    : List.of();
            List<String> tableStructures = body != null && body.get("table_structures") instanceof List
                    ? ((List<?>) body.get("table_structures")).stream().map(String::valueOf).collect(Collectors.toList())
                    : List.of();
            if (userPrompt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "user_prompt required"));
            }

            String selected = String.join(", ", selectedTables);
            String structs = tableStructures.stream().collect(Collectors.joining(", "));

            String prompt = "" +
                    "- Role(角色): 数据库开发工程师  \n" +
                    "- Background（背景）: 用户需要根据指定的数据库表结构和业务需求，生成用于查询、插入、更新或删除数据的 SQL 语句。当前上下文提供了可用表、表结构及自然语言描述的需求。  \n" +
                    "- Profile(轮廓): 你是一位经验丰富的数据库开发工程师，精通 SQL 语言，熟悉 MySQL 5.7+ 的语法特性与最佳实践，能够基于有限信息推断合理的表关联关系和业务逻辑。  \n" +
                    "- Skills(技能): 熟练编写高效、安全、可维护的 SQL 语句，包括多表 JOIN、子查询、条件过滤、排序分页等；能根据模糊需求合理推导实现逻辑（如“最近”→按时间倒序+LIMIT）；注重字段限定、别名使用与性能优化。  \n" +
                    "- Goals(目标): 根据用户提供的表信息和自然语言需求，生成一条语法正确、逻辑严谨、执行高效且符合 MySQL 5.7+ 标准的 SQL 语句。  \n" +
                    "- Constrains（约束条件）:  \n" +
                    "  1. 仅输出最终 SQL 语句，不得包含解释、注释、Markdown 或额外文本。  \n" +
                    "  2. 语句末尾不得添加分号（;）。  \n" +
                    "  3. 禁止使用 SELECT *，仅返回需求明确提及或逻辑必需的字段。  \n" +
                    "  4. 多表操作时，基于惯例（主键为 id，外键为 {table_name}_id）推断 JOIN 条件；优先使用 INNER JOIN，仅当语义允许空值时使用 LEFT JOIN。  \n" +
                    "  5. 所有表必须使用简洁别名（如 users → u），重复字段必须用别名限定（如 u.name）。  \n" +
                    "  6. 对模糊表述（如“最近”“最多”“最新记录”）按常规业务逻辑实现（如 ORDER BY created_at DESC LIMIT 1）。  \n" +
                    "  7. 确保语句可执行，避免歧义、无效引用或破坏数据完整性的操作。  \n" +
                    "- OutputFormat（输出格式）: 纯文本 SQL 语句，格式清晰、缩进合理、便于直接执行。  \n" +
                    "- Workflow(工作流程):  \n" +
                    "  1. 解析用户需求，识别操作类型（SELECT/INSERT/UPDATE/DELETE）、目标表、关键字段及过滤条件。  \n" +
                    "  2. 结合表结构与命名惯例，构建语句骨架，合理推断 JOIN 关系与 WHERE 条件。  \n" +
                    "  3. 优化字段选择、别名使用与排序逻辑，确保语句简洁高效。  \n" +
                    "- Examples(实例):  \n" +
                    "  - 查询用户姓名和邮箱：  \n" +
                    "    SELECT name, email FROM users  \n" +
                    "  - 插入新订单：  \n" +
                    "    INSERT INTO orders (order_id, user_id, order_date, total_amount) VALUES (1, 1001, '2025-11-05', 99.99)  \n" +
                    "  - 更新用户邮箱：  \n" +
                    "    UPDATE users SET email = 'new_email@example.com' WHERE user_id = 1001  \n" +
                    "  - 删除已取消订单：  \n" +
                    "    DELETE FROM orders WHERE status = 'cancelled'  \n\n" +
                    "-【可用表】 \n" + selected + " \n\n" +
                    "-【表结构】 \n{" + structs + "} \n\n" +
                    "-【用户需求】 \n\"" + userPrompt + "\" \n\n" +
                    "请严格遵循上述角色设定与约束条件，直接输出符合要求的 SQL 语句。";

            log.info("AI 提示词：{}", prompt);
            String sql = pythonOpenApiClient.deepSeekChat("请帮我生成sql",prompt,null);
            logger.info("调用AI生成SQL返回:{}",sql);
            return ResponseEntity.ok(Map.of("sql", sql == null ? "" : sql));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }




    @PostMapping("/exam/insights")
    @Operation(summary = "考试结果分析", description = "生成考试成绩的深度分析报告")
    public ResponseEntity<?> examInsights(@RequestBody Map<String, Object> body) {
        logger.info("开始调用AI总结考试结果--------------------------------");
        try {
            String subject = body != null ? String.valueOf(body.getOrDefault("subject", "")).trim() : "";
            Integer grade = body != null && body.get("grade") != null ? Integer.valueOf(String.valueOf(body.get("grade"))) : null;
            String userName = body != null ? String.valueOf(body.getOrDefault("userName", "")).trim() : "";
            Integer correctNum = body != null && body.get("correctNum") != null ? Integer.valueOf(String.valueOf(body.get("correctNum"))) : 0;
            Integer wrongNum = body != null && body.get("wrongNum") != null ? Integer.valueOf(String.valueOf(body.get("wrongNum"))) : 0;
            String score = body != null ? String.valueOf(body.getOrDefault("score", "")).trim() : "";
            List<?> details = body != null && body.get("details") instanceof List ? (List<?>) body.get("details") : List.of();
            String detailText = details.stream().map(String::valueOf).collect(Collectors.joining("\n"));

            StringBuilder sb = new StringBuilder();

            // 提示词精简开始
            sb.append("角色：小学资深教师（30年经验），精通1-6年级语文/数学/英语及儿童心理。\n");
            sb.append("任务：根据下方考试数据，输出专业分析报告和学习建议。\n");
            sb.append("要求：严格遵循以下Markdown结构，总字数不超过2000字符。语言需专业、深入、鼓励性。\n\n");

            sb.append("## ** 成绩概况与资深教师点评**\n");
            sb.append("## ** 学科表现深度分析** (重点指出失分背后的知识点或能力缺陷)\n");
            sb.append("## ** 针对性学习建议 (分科目)** (必须包含至少1条家长配合的建议)\n");
            sb.append("## ** 下阶段总体目标与寄语**\n\n");
            sb.append("--- 考试数据 ---\n");
            sb.append("- 科目：").append(subject).append("\n");
            sb.append("- 年级：").append(grade == null ? "" : grade).append("年级\n");
            sb.append("- 正确/错误：").append(correctNum).append(" / ").append(wrongNum).append("\n");
            sb.append("- 错题明细：\n");
            sb.append(detailText).append("\n\n");
            sb.append("请严格按照上述结构输出，避免任何额外的解释性文字或Markdown格式之外的内容。");
            // 提示词精简结束
            String finalPrompt = sb.toString();
            String resp = pythonOpenApiClient.deepSeekChat("请给出本次考试的考试小结",finalPrompt,null);
            logger.info("AI返回总结考试结果--------------------------------{}", resp);
            if (resp == null) resp = "";
            if (resp.length() > 2000) resp = resp.substring(0, 2000);
            return ResponseEntity.ok(Map.of("report", resp));
        } catch (Exception e) {
           logger.info("AI考试异常");
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }




    @PostMapping("/coze/workflow")
    @Operation(summary = "Coze工作流", description = "执行Coze工作流")
    public ResponseEntity<?> workflow(@RequestBody CozeWorkFlowRequest request) {
        try {
            if (request == null || StringUtils.isEmpty(request.getType())) {
                throw new IllegalArgumentException("请求参数或类型不能为空");
            }
            if (TYPE_AUTO_CASE.equals(request.getType())) {
                if (StringUtils.hasText(request.getDocumentId()) && StringUtils.hasText(request.getInput())) {
                    throw new IllegalArgumentException("需求描述（input）和文档 ID（documentId）不能同时存在");
                }
                if (!StringUtils.hasText(request.getDocumentId()) && !StringUtils.hasText(request.getInput())) {
                    throw new IllegalArgumentException("需求描述（input）或文档 ID（documentId）必须提供其一");
                }
            }

            String resp = pythonOpenApiClient.cozeWorkFlow(request);
            logger.info("工作流执行结束--------------------------------{}", resp);
            if (resp == null) resp = "";
            if (resp.length() > 2000) resp = resp.substring(0, 2000);
            return ResponseEntity.ok(Map.of("message", resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
        }
    }


    /**
     * 直接调用seepseek模型，没有任何
     * @param request
     * @return
     */
    @PostMapping("/deeoSeekChat/model")
    @Operation(summary = "DeepSeek模型对话", description = "直接调用DeepSeek模型进行对话")
    public ResponseEntity<?> deeoSeekChat(@RequestBody ModelRequest request) {
        logger.info("直接调用seepseek模型：request>>>{}", JSON.toJSONString(request));
        try {
            String resp = pythonOpenApiClient.deepSeekChat(request.getMessage(),request.getPrompt(),null);
            logger.info("工作流执行结束--------------------------------{}", resp);
            if (resp == null) resp = "";
            return ResponseEntity.ok(Map.of("message", resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
        }
    }




    /**
     * 直接调用seepseek模型，进行提示词优化
     * @param request
     * @return
     */
    @PostMapping("/prompt/optimizePrompt")
    @Operation(summary = "提示词优化", description = "使用AI优化提示词")
    public ResponseEntity<?> optimizePrompt(@RequestBody PromptBaseRequest request) {
        logger.info("开始执行提示词优化，请求参数: {}", JSON.toJSONString(request));

        final String DEFAULT_ERROR_PROMPT = "";
        final String DEFAULT_ERROR_REASON = "模型服务异常或返回结果解析失败。";

        try {
            // 0. 解析期望的占位符集合
            Set<String> requiredPlaceholders = PlaceholderUtil.getExpectedPlaceholders(request.getParamSchema());
            String placeholderList = requiredPlaceholders.stream()
                    .map(s -> "{" + s + "}")
                    .collect(Collectors.joining(", "));

            // 1. 构造增强型 System Prompt (元提示词) - **使用纯中文标签**
            String systemPrompt = String.format("""
                # 角色设定 (Role)
                你现在是世界上最顶尖的**提示词（Prompt）工程专家**、AIGC内容战略家和语言优化大师。你的核心任务是接收用户提供的原始请求，并根据提示词工程的最佳实践，将其改写、优化并扩展成一个**结构严谨、意图清晰、输出可控**的专业提示词。
                # 核心优化策略与要求 (Optimization Strategy)
                ## 策略一：结构化与增强 (Structure & Enhance)
                将原始输入转化为以下专业提示词的五大要素：
                1.  **[角色定位]：** 为AI模型指定一个具体的、权威的、可信赖的身份。
                2.  **[任务目标]：** 明确、量化、具体地阐述任务目标和最终产物。
                3.  **[输入信息]：** 提供必要的背景信息、输入数据或引用材料。
                4.  **[约束条件]：** 设定所有的限制条件和规则，以控制输出质量。
                5.  **[执行步骤]：** 如果任务复杂，请将生成过程分解为2-5个清晰的步骤。
                
                ## 策略二：参数化 (强制约束)
                **你必须将以下占位符列表中的所有变量: %s 以 {variable_name} 的形式完整嵌入到[优化后提示词]的"任务"或"约束"部分。**
                **如果原始提示词中不包含这些变量，你也必须为它们在优化后的提示词中创造合适的上下文。丢失任何一个占位符将导致提示词无法使用!**
                
                ## 策略三：角色整合
                将原始提示词中定义的"角色"或"背景"信息, 根据提供的 `role_type` (如 'system') 的要求, 融入到提示词的 "任务" 或 "约束" 部分。

                # 输出格式要求 (Output Format)
                **你必须严格按照以下格式输出结果，不要添加任何额外的解释或Markdown包裹。**
                [优化后提示词]
                [此处是优化后的提示词内容，使用纯中文标签（如[角色定位]）和Markdown格式]
                [优化理由]
                [此处是优化理由列表，使用Markdown格式]
                
                # 禁止输出
                - 任何关于大模型工作机制的解释。
                - 任何与任务无关的内容。
                """, placeholderList, placeholderList);

            // 2. 构造最终 Prompt
            String rawPrompt = request.getPromt() != null ? request.getPromt() : "";
            String finalPrompt = systemPrompt + "\n\n### 上下文信息\n"
                    + "1. **角色类型 (role_type)**: " + request.getRoleType() + "\n"
                    + "2. **参数结构 (param_schema)**:\n```json\n" + request.getParamSchema() + "\n```\n"
                    + "### 原始提示词 (raw_prompt)：\n" + rawPrompt;

            logger.info("finalPrompt>>>{}",JSON.toJSONString(finalPrompt));

            // 默认的用户消息
            if(StringUtils.isEmpty(request.getMessage())) {
                request.setMessage("请根据上述规则和上下文信息，开始优化我的原始提示词。");
            }

            // 3. 调用模型
            String resp = pythonOpenApiClient.deepSeekChat(request.getMessage(), finalPrompt, null);

            if (resp == null || resp.trim().isEmpty()) {
                logger.warn("LLM返回空结果，无法进行校验。");
                return ResponseEntity.ok(Map.of("optimizedPrompt", DEFAULT_ERROR_PROMPT,
                        "optimizationReason", "LLM返回空结果。"));
            }
            logger.info("提示词优化完成 ---- 原始响应:\n{}", resp);

            // 4. 解析并结构化输出 (使用正则表达式)
            Map<String, String> parsedResult = new HashMap<>();

            // 模式1: 提取 [优化后提示词] 的内容
            // Pattern.DOTALL 确保 . 匹配包括换行符在内的所有字符
            Pattern promptPattern = Pattern.compile("\\[优化后提示词\\]\\s*?(.*?)\\s*\\[优化理由\\]", Pattern.DOTALL);
            Matcher promptMatcher = promptPattern.matcher(resp);

            if (promptMatcher.find()) {
                String optimizedPrompt = promptMatcher.group(1).trim();
                parsedResult.put("optimizedPrompt", optimizedPrompt);
            }

            // 模式2: 提取 [优化理由] 之后的内容，直到字符串结束
            Pattern reasonPattern = Pattern.compile("\\[优化理由\\]\\s*?(.*)", Pattern.DOTALL);
            Matcher reasonMatcher = reasonPattern.matcher(resp);

            if (reasonMatcher.find()) {
                String optimizationReason = reasonMatcher.group(1).trim();
                parsedResult.put("optimizationReason", optimizationReason);
            }

            // 5. 返回结构化 JSON 结果
            return ResponseEntity.ok(Map.of(
                    "optimizedPrompt", parsedResult.getOrDefault("optimizedPrompt", DEFAULT_ERROR_PROMPT),
                    "optimizationReason", parsedResult.getOrDefault("optimizationReason", DEFAULT_ERROR_REASON)
            ));

        } catch (Exception e) {
            logger.error("提示词优化失败", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("message", "提示词优化失败：" + e.getMessage())
            );
        }
    }




    /**
     * 直接调用seepseek模型，没有任何
     * @param request
     * @return
     */
    @PostMapping("/aliyunCreateImage")
    @Operation(summary = "调用阿里的文生图接口", description = "调用阿里的文生图接口")
    public ResponseEntity<?> aliyunCreateImage(@RequestBody AliyunCreateImage request) {
        try {
            String resp = pythonOpenApiClient.aliyunCreateImage(request);
            logger.info("工作流执行结束--------------------------------{}", resp);
            if (resp == null) resp = "";
            return ResponseEntity.ok(Map.of("message", resp));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
        }

    }








    /**
     * 调用阿里的图片理解
     * @param file 上传的图片文件
     * @param message 用户消息
     * @param role 角色
     * @param context 上下文
     * @param prompt 提示词
     * @return
     */
    @PostMapping(value = "/aliyunUnderstandImage", consumes = "multipart/form-data")
    @Operation(summary = "调用阿里的图片理解", description = "调用阿里的图片理解")
    public ResponseEntity<?> aliyunUnderstandImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String context,
            @RequestParam(required = false) String prompt) {
        logger.info("Received request to aliyunUnderstandImage with file: {}, message: {}, role: {}, context: {}, prompt: {}", 
            file != null ? file.getOriginalFilename() : "null", message, role, context, prompt);
        
        try {
            // 检查文件是否为空
            if (file == null || file.isEmpty()) {
                logger.warn("File is null or empty");
                return ResponseEntity.badRequest().body(Map.of("message", "文件不能为空"));
            }

            // 获取文件类型
            String imageType = getFileExtension(file);
            logger.info("File extension: {}", imageType);
            
            // 将文件转换为Base64编码
            String imageBase64 = Base64.getEncoder().encodeToString(file.getBytes());
            logger.info("File converted to base64, size: {} bytes", imageBase64.length());
            
            // 创建ImageUnderstanding对象
            ImageUnderstanding request = new ImageUnderstanding(message, role, context, prompt, imageType, imageBase64);
            logger.info("Created ImageUnderstanding request");
            
            // 调用服务
            String resp = pythonOpenApiClient.aliyunUnderstandImage(request);
            logger.info("调用阿里的图片理解执行结束--------------------------------{}", resp);
            if (resp == null) resp = "";
            return ResponseEntity.ok(Map.of("message", resp));
        } catch (IOException e) {
            logger.error("文件处理异常", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "文件处理异常: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("调用阿里图片理解服务异常", e);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", e.getMessage()));
        }

    }
    
    /**
     * 获取文件扩展名
     * @param file 上传的文件
     * @return 文件扩展名
     */
    private String getFileExtension(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        return "";
    }





















}
