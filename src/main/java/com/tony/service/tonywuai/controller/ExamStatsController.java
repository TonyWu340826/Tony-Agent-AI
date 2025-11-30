package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.repository.StudentExamRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exams/stats")
@RequiredArgsConstructor
public class ExamStatsController {

    private final StudentExamRecordRepository repo;

    @GetMapping("/overview")
    public ResponseEntity<Map<String,Object>> overview(@RequestParam(required = false) Integer grade,
                                                       @RequestParam(required = false) String subject) {
        Double avg = repo.avgAccuracy(grade, subject);
        Long count = repo.recordCount(grade, subject);
        return ResponseEntity.ok(Map.of(
                "grade", grade,
                "subject", subject,
                "avgAccuracy", avg != null ? avg : 0.0,
                "recordCount", count != null ? count : 0L
        ));
    }
}

