package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.entity.VisitLog;
import com.tony.service.tonywuai.repository.VisitLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.sql.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/visit")
@RequiredArgsConstructor
@Tag(name = "访问日志", description = "访问日志记录与统计接口")
public class VisitLogController {

    private final VisitLogRepository visitLogRepository;

    @PostMapping("/logs")
    @Operation(summary = "记录访问日志", description = "记录用户的访问信息")
    public ResponseEntity<?> addVisit(@Parameter(description = "日志信息") @RequestBody Map<String, Object> body, HttpServletRequest request) {
        String ip = getClientIp(request);
        String ua = request.getHeader("User-Agent");
        String ref = request.getHeader("Referer");
        VisitLog v = new VisitLog();
        v.setIp(ip);
        v.setUserAgent(ua);
        v.setReferrer(ref);
        Object username = body.get("username");
        String uname = (username == null || String.valueOf(username).isBlank()) ? "访客" : String.valueOf(username);
        v.setUsername(uname);
        Object userId = body.get("userId");
        if (userId instanceof Number) v.setUserId(((Number) userId).longValue());
        Object path = body.get("path");
        v.setPath(path != null ? String.valueOf(path) : request.getRequestURI());
        visitLogRepository.save(v);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/today/count")
    @Operation(summary = "今日访问量", description = "获取今日访问总数")
    public ResponseEntity<?> todayCount() {
        Date today = Date.valueOf(LocalDate.now());
        long count = visitLogRepository.countToday(today);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/today/list")
    @Operation(summary = "今日访问列表", description = "分页获取今日访问日志")
    public ResponseEntity<?> todayList(@Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
                                       @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        Date today = Date.valueOf(LocalDate.now());
        Page<VisitLog> p = visitLogRepository.findToday(today, pageable);
        return ResponseEntity.ok(p);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) return realIp;
        return request.getRemoteAddr();
    }
}
