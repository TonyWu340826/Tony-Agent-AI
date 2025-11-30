package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.ExamQuestionCreateRequest;
import com.tony.service.tonywuai.dto.ExamQuestionDTO;
import com.tony.service.tonywuai.service.ExamQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams/questions")
@RequiredArgsConstructor
public class ExamQuestionController {

    private final ExamQuestionService service;

    @PostMapping
    public ResponseEntity<ExamQuestionDTO> create(@Valid @RequestBody ExamQuestionCreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamQuestionDTO> update(@PathVariable Long id, @Valid @RequestBody ExamQuestionCreateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamQuestionDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    @GetMapping
    public ResponseEntity<Page<ExamQuestionDTO>> search(@RequestParam(required = false) String subject,
                                                        @RequestParam(required = false) Integer grade,
                                                        @RequestParam(required = false) String type,
                                                        @RequestParam(required = false) String tag,
                                                        @RequestParam(required = false) String q,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(service.search(subject, grade, type, tag, q, page, size));
    }

    @GetMapping("/by-ids")
    public ResponseEntity<java.util.List<ExamQuestionDTO>> byIds(@RequestParam(name = "ids") String idsCsv) {
        java.util.List<Long> ids = java.util.Arrays.stream(idsCsv.split(","))
                .map(String::trim).filter(s -> !s.isEmpty())
                .map(s -> { try { return Long.parseLong(s); } catch(Exception e){ return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
        return ResponseEntity.ok(service.listByIds(ids));
    }
}
