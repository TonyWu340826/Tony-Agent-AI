package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.CategoryCreateRequest;
import com.tony.service.tonywuai.dto.CategoryNodeDTO;
import com.tony.service.tonywuai.dto.CategoryUpdateRequest;
import com.tony.service.tonywuai.entity.Category;
import com.tony.service.tonywuai.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "分类管理", description = "分类管理相关接口")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/tree")
    @Operation(summary = "获取分类树", description = "获取层级结构的分类树")
    public ResponseEntity<List<CategoryNodeDTO>> tree(
            @Parameter(description = "分类类型 (1:文章, 2:AI工具, 3:VIP)") 
            @RequestParam(value = "type", required = false) Integer type) {
        return ResponseEntity.ok(categoryService.tree(type));
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取分类", description = "根据ID获取单个分类详情")
    public ResponseEntity<Category> get(
            @Parameter(description = "分类ID", required = true) 
            @PathVariable Long id) {
        Category c = categoryService.get(id);
        if (c == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(c);
    }

    @GetMapping
    @Operation(summary = "分类列表", description = "分页查询分类列表，支持筛选")
    public ResponseEntity<Page<Category>> list(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search,
            @Parameter(description = "精确匹配类型") @RequestParam(value = "type", required = false) Integer type,
            @Parameter(description = "父级ID") @RequestParam(value = "parentId", required = false) Long parentId,
            @Parameter(description = "最大类型过滤 (<= maxType)") @RequestParam(value = "maxType", required = false) Integer maxType
    ) {
        return ResponseEntity.ok(categoryService.list(PageRequest.of(Math.max(0, page), size), search, type, parentId, maxType));
    }

    @PostMapping
    @Operation(summary = "创建分类", description = "创建一个新的分类")
    public ResponseEntity<?> create(@RequestBody CategoryCreateRequest req) {
        try {
            Category c = categoryService.create(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(c);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类", description = "更新已存在的分类信息")
    public ResponseEntity<?> update(
            @Parameter(description = "分类ID", required = true) @PathVariable Long id, 
            @RequestBody CategoryUpdateRequest req) {
        try {
            Category c = categoryService.update(id, req);
            return ResponseEntity.ok(c);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类", description = "根据ID删除分类")
    public ResponseEntity<?> delete(
            @Parameter(description = "分类ID", required = true) @PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
