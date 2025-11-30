package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.openapi.PythonOpenApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/open")
@RequiredArgsConstructor
@Slf4j
public class OpenApiController {

    private final PythonOpenApiClient pythonOpenApiClient;
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @PostMapping("/chat")
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
            String sql = pythonOpenApiClient.chat(prompt);
            logger.info("调用AI生成SQL返回:{}",sql);
            return ResponseEntity.ok(Map.of("sql", sql == null ? "" : sql));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }
















    @PostMapping("/exam/insights")
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
            String detailText = details.stream().map(String::valueOf).collect(java.util.stream.Collectors.joining("\n"));

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
            String resp = pythonOpenApiClient.chat(finalPrompt);
            logger.info("AI返回总结考试结果--------------------------------{}", resp);
            if (resp == null) resp = "";
            if (resp.length() > 2000) resp = resp.substring(0, 2000);
            return ResponseEntity.ok(Map.of("report", resp));
        } catch (Exception e) {
           logger.info("AI考试异常");
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "upstream error"));
        }
    }
}
