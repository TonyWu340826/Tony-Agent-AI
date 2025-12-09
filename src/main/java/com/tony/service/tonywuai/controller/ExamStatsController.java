package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.repository.StudentExamRecordRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/exams/stats")
@RequiredArgsConstructor
@Tag(name = "考试统计", description = "考试数据统计分析接口")
public class ExamStatsController {

    private final StudentExamRecordRepository repo;

    @GetMapping("/overview")
    @Operation(summary = "考试概览", description = "根据年级和科目统计考试平均正确率和记录数")
    public ResponseEntity<Map<String,Object>> overview(
            @Parameter(description = "年级") @RequestParam(required = false) Integer grade,
            @Parameter(description = "科目") @RequestParam(required = false) String subject) {
        Double avg = repo.avgAccuracy(grade, subject);
        Long count = repo.recordCount(grade, subject);
        return ResponseEntity.ok(Map.of(
                "grade", grade != null ? grade : "全部",
                "subject", subject != null ? subject : "全部",
                "avgAccuracy", avg != null ? avg : 0.0,
                "recordCount", count != null ? count : 0L
        ));
    }
}

