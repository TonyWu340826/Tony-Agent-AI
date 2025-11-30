package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.ExamSessionCreateRequest;
import com.tony.service.tonywuai.dto.ExamSessionDTO;
import com.tony.service.tonywuai.service.ExamSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams/sessions")
@RequiredArgsConstructor
public class ExamSessionController {

    private final ExamSessionService service;

  @PostMapping
  public ResponseEntity<ExamSessionDTO> create(@Valid @RequestBody ExamSessionCreateRequest req) {
    return ResponseEntity.ok(service.create(req));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ExamSessionDTO> update(@PathVariable Long id, @Valid @RequestBody ExamSessionCreateRequest req) {
    return ResponseEntity.ok(service.update(id, req));
  }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.noContent().build(); }

    @GetMapping
  public ResponseEntity<Page<ExamSessionDTO>> search(@RequestParam(required = false) Long userId,
                                                     @RequestParam(required = false) String userName,
                                                     @RequestParam(required = false) String subject,
                                                     @RequestParam(required = false) Integer grade,
                                                     @RequestParam(required = false) String code,
                                                     @RequestParam(required = false) Integer status,
                                                     @RequestParam(required = false, name = "q") String q,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size){
    return ResponseEntity.ok(service.search(userId, userName, subject, grade, code, q, status, page, size));
  }
}
