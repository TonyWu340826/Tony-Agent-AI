package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.ExamSessionCreateRequest;
import com.tony.service.tonywuai.dto.ExamSessionDTO;
import com.tony.service.tonywuai.service.ExamSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams/sessions")
@RequiredArgsConstructor
@Tag(name = "考试会话管理", description = "考试会话的创建、更新、查询和删除接口")
public class ExamSessionController {

    private final ExamSessionService service;

    @PostMapping
    @Operation(summary = "创建会话", description = "创建新的考试会话")
    public ResponseEntity<ExamSessionDTO> create(@Valid @RequestBody ExamSessionCreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新会话", description = "更新已有的考试会话")
    public ResponseEntity<ExamSessionDTO> update(
            @Parameter(description = "会话ID", required = true) @PathVariable Long id, 
            @Valid @RequestBody ExamSessionCreateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除会话", description = "删除指定的考试会话")
    public ResponseEntity<Void> delete(
            @Parameter(description = "会话ID", required = true) @PathVariable Long id){ 
        service.delete(id); 
        return ResponseEntity.noContent().build(); 
    }

    @GetMapping
    @Operation(summary = "搜索会话", description = "根据条件分页搜索考试会话")
    public ResponseEntity<Page<ExamSessionDTO>> search(
            @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "用户名") @RequestParam(required = false) String userName,
            @Parameter(description = "科目") @RequestParam(required = false) String subject,
            @Parameter(description = "年级") @RequestParam(required = false) Integer grade,
            @Parameter(description = "会话代码") @RequestParam(required = false) String code,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "搜索关键词") @RequestParam(required = false, name = "q") String q,
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok(service.search(userId, userName, subject, grade, code, q, status, page, size));
    }
}
