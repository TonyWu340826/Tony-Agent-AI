package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.ExamQuestionCreateRequest;
import com.tony.service.tonywuai.dto.ExamQuestionDTO;
import com.tony.service.tonywuai.service.ExamQuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams/questions")
@RequiredArgsConstructor
@Tag(name = "考试题目管理", description = "题库题目的增删改查接口")
public class ExamQuestionController {

    private final ExamQuestionService service;

    @PostMapping
    @Operation(summary = "创建题目", description = "创建新的考试题目")
    public ResponseEntity<ExamQuestionDTO> create(@Valid @RequestBody ExamQuestionCreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新题目", description = "更新已有的考试题目")
    public ResponseEntity<ExamQuestionDTO> update(
            @Parameter(description = "题目ID", required = true) @PathVariable Long id, 
            @Valid @RequestBody ExamQuestionCreateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除题目", description = "删除指定的考试题目")
    public ResponseEntity<Void> delete(
            @Parameter(description = "题目ID", required = true) @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取题目详情", description = "根据ID获取题目详细信息")
    public ResponseEntity<ExamQuestionDTO> get(
            @Parameter(description = "题目ID", required = true) @PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @GetMapping
    @Operation(summary = "搜索题目", description = "根据条件分页搜索题目")
    public ResponseEntity<Page<ExamQuestionDTO>> search(
            @Parameter(description = "科目") @RequestParam(required = false) String subject,
            @Parameter(description = "年级") @RequestParam(required = false) Integer grade,
            @Parameter(description = "题型") @RequestParam(required = false) String type,
            @Parameter(description = "标签") @RequestParam(required = false) String tag,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String q,
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.search(subject, grade, type, tag, q, page, size));
    }

    @GetMapping("/by-ids")
    @Operation(summary = "批量获取题目", description = "根据ID列表(逗号分隔)批量获取题目")
    public ResponseEntity<java.util.List<ExamQuestionDTO>> byIds(
            @Parameter(description = "题目ID列表，逗号分隔") @RequestParam(name = "ids") String idsCsv) {
        java.util.List<Long> ids = java.util.Arrays.stream(idsCsv.split(","))
                .map(String::trim).filter(s -> !s.isEmpty())
                .map(s -> { try { return Long.parseLong(s); } catch(Exception e){ return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
        return ResponseEntity.ok(service.listByIds(ids));
    }
}
