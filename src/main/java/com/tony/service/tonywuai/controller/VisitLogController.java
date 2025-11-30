package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.entity.VisitLog;
import com.tony.service.tonywuai.repository.VisitLogRepository;
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
public class VisitLogController {

    private final VisitLogRepository visitLogRepository;

    @PostMapping("/logs")
    public ResponseEntity<?> addVisit(@RequestBody Map<String, Object> body, HttpServletRequest request) {
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
    public ResponseEntity<?> todayCount() {
        Date today = Date.valueOf(LocalDate.now());
        long count = visitLogRepository.countToday(today);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/today/list")
    public ResponseEntity<?> todayList(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
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
