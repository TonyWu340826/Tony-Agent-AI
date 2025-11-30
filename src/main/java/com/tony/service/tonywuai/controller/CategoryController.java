package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.CategoryCreateRequest;
import com.tony.service.tonywuai.dto.CategoryNodeDTO;
import com.tony.service.tonywuai.dto.CategoryUpdateRequest;
import com.tony.service.tonywuai.entity.Category;
import com.tony.service.tonywuai.service.CategoryService;
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
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/tree")
    public ResponseEntity<List<CategoryNodeDTO>> tree(@RequestParam(value = "type", required = false) Integer type) {
        return ResponseEntity.ok(categoryService.tree(type));
    }

    @GetMapping
    public ResponseEntity<Page<Category>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(value = "type", required = false) Integer type
    ) {
        return ResponseEntity.ok(categoryService.list(PageRequest.of(Math.max(0, page), size), search, type));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CategoryCreateRequest req) {
        try {
            Category c = categoryService.create(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(c);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CategoryUpdateRequest req) {
        try {
            Category c = categoryService.update(id, req);
            return ResponseEntity.ok(c);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
