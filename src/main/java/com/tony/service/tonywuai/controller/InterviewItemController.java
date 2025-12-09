package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.InterviewItemCreateRequest;
import com.tony.service.tonywuai.dto.InterviewItemUpdateRequest;
import com.tony.service.tonywuai.entity.InterviewItem;
import com.tony.service.tonywuai.repository.CategoryRepository;
import com.tony.service.tonywuai.repository.UserRepository;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.repository.InterviewItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@Tag(name = "面试题目管理", description = "面试题目的增删改查及展示接口")
public class InterviewItemController {

    private final InterviewItemRepository interviewItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @GetMapping("/admin/items")
    @Operation(summary = "题目列表(管理)", description = "管理员分页查询题目列表")
    public ResponseEntity<Page<Map<String,Object>>> adminList(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search
    ) {
        var pageable = PageRequest.of(Math.max(0, page), size);
        List<InterviewItem> all = interviewItemRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc();
        List<InterviewItem> filtered = all.stream()
                .filter(i -> categoryId == null || i.getCategoryId().equals(categoryId))
                .filter(i -> search == null || search.isBlank() ||
                        (i.getTitle()!=null && i.getTitle().toLowerCase().contains(search.toLowerCase())) ||
                        (i.getQuestion()!=null && i.getQuestion().toLowerCase().contains(search.toLowerCase())))
                .collect(Collectors.toList());
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        var slice = filtered.subList(start, end);
        java.util.List<java.util.Map<String,Object>> dtoList = slice.stream().map(i -> {
            java.util.Map<String,Object> m = new java.util.LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("title", i.getTitle());
            m.put("categoryId", i.getCategoryId());
            m.put("visibilityVip", i.getVisibilityVip());
            m.put("createdAt", i.getCreatedAt());
            m.put("categoryName", categoryRepository.findById(i.getCategoryId()).map(c->c.getName()).orElse(null));
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(dtoList, pageable, filtered.size()));
    }

    @PostMapping("/admin/items")
    @Operation(summary = "创建题目", description = "管理员创建新的面试题目")
    public ResponseEntity<?> adminCreate(@RequestBody InterviewItemCreateRequest req) {
        try {
            if (req.getCategoryId() == null || categoryRepository.findById(req.getCategoryId()).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "分类不存在"));
            }
            InterviewItem i = new InterviewItem();
            i.setCategoryId(req.getCategoryId());
            i.setTitle(req.getTitle());
            i.setQuestion(req.getQuestion());
            i.setSolution(req.getSolution());
            i.setVisibilityVip(req.getVisibilityVip() == null ? 0 : req.getVisibilityVip());
            interviewItemRepository.save(i);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "id", i.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/admin/items/{id}")
    @Operation(summary = "更新题目", description = "管理员更新面试题目信息")
    public ResponseEntity<?> adminUpdate(
            @Parameter(description = "题目ID") @PathVariable Long id, 
            @RequestBody InterviewItemUpdateRequest req) {
        InterviewItem i = interviewItemRepository.findById(id).orElse(null);
        if (i == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "未找到"));
        if (req.getCategoryId() != null) {
            if (categoryRepository.findById(req.getCategoryId()).isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "分类不存在"));
            }
            i.setCategoryId(req.getCategoryId());
        }
        if (req.getTitle() != null) i.setTitle(req.getTitle());
        if (req.getQuestion() != null) i.setQuestion(req.getQuestion());
        if (req.getSolution() != null) i.setSolution(req.getSolution());
        if (req.getVisibilityVip() != null) i.setVisibilityVip(req.getVisibilityVip());
        interviewItemRepository.save(i);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/admin/items/{id}")
    @Operation(summary = "删除题目", description = "管理员删除面试题目")
    public ResponseEntity<?> adminDelete(
            @Parameter(description = "题目ID") @PathVariable Long id) {
        InterviewItem i = interviewItemRepository.findById(id).orElse(null);
        if (i == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "未找到"));
        i.setIsDeleted(true);
        interviewItemRepository.save(i);
        return ResponseEntity.ok(Map.of("success", true));
    }
    @GetMapping("/items")
    @Operation(summary = "题目列表(公开)", description = "公开查询面试题目列表，支持多种筛选")
    public ResponseEntity<Page<Map<String,Object>>> publicList(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search,
            @Parameter(description = "题目类型") @RequestParam(required = false) String type,
            @Parameter(hidden = true) org.springframework.security.core.Authentication authentication
    ) {
        var pageable = PageRequest.of(Math.max(0, page), size);
        List<InterviewItem> all = interviewItemRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc();
        boolean allowVip;
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            var opt = userRepository.findByUsername(username);
            if (opt.isPresent() && opt.get().getVipLevel() != null && opt.get().getVipLevel() == 99) {
                allowVip = true;
            } else {
                allowVip = false;
            }
        } else {
            allowVip = false;
        }
        List<InterviewItem> filtered = all.stream()
                .filter(i -> categoryId == null || i.getCategoryId().equals(categoryId))
                .filter(i -> type == null || type.isBlank() || (i.getType() != null && i.getType().equals(type)))
                .filter(i -> search == null || search.isBlank() ||
                        (i.getTitle()!=null && i.getTitle().toLowerCase().contains(search.toLowerCase())) ||
                        (i.getQuestion()!=null && i.getQuestion().toLowerCase().contains(search.toLowerCase())))
                .filter(i -> allowVip ? (i.getVisibilityVip()==0 || i.getVisibilityVip()==99) : i.getVisibilityVip()==0)
                .collect(Collectors.toList());
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        var slice = filtered.subList(start, end);
        java.util.List<java.util.Map<String,Object>> dtoList = slice.stream().map(i -> {
            java.util.Map<String,Object> m = new java.util.LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("title", i.getTitle());
            m.put("question", i.getQuestion());
            m.put("solution", i.getSolution());
            m.put("type", i.getType());
            m.put("categoryId", i.getCategoryId());
            m.put("visibilityVip", i.getVisibilityVip());
            m.put("createdAt", i.getCreatedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(new PageImpl<>(dtoList, pageable, filtered.size()));
    }
}
