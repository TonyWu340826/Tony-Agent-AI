package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.AIToolCreateRequest;
import com.tony.service.tonywuai.dto.AIToolDTO;
import com.tony.service.tonywuai.service.AIToolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * AI 工具管理和查询接口
 * 假设：POST, PUT, DELETE 接口需要管理员权限
 */
@RestController
@RequestMapping("/api/tools")
@RequiredArgsConstructor
@Tag(name = "AI工具管理", description = "AI工具的创建、更新、查询等接口")
public class AIToolController {

    private final AIToolService aiToolService;

    /**
     * [公共/用户接口] 获取所有已激活的 AI 工具列表 (用于前端菜单展示)
     * GET /api/tools/active
     */
    @GetMapping("/active")
    @Operation(summary = "获取已激活工具", description = "获取所有已激活的 AI 工具列表，用于前端菜单展示")
    public ResponseEntity<List<AIToolDTO>> getActiveTools(
            @Parameter(description = "工具类型筛选") @RequestParam(value = "type", required = false) Integer type) {
        List<AIToolDTO> tools = (type == null)
                ? aiToolService.getActiveTools()
                : aiToolService.searchTools(type, true, null);
        return ResponseEntity.ok(tools);
    }

    // --- 以下接口通常需要管理员权限 ---

    /**
     * [管理员接口] 创建新的 AI 工具
     * POST /api/tools
     */
    @PostMapping
    @Operation(summary = "创建AI工具", description = "管理员创建新的 AI 工具")
    public ResponseEntity<AIToolDTO> createTool(@Valid @RequestBody AIToolCreateRequest request) {
        AIToolDTO createdTool = aiToolService.createTool(request);
        // 返回 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTool);
    }

    /**
     * [管理员接口] 更新 AI 工具信息
     * PUT /api/tools/{id}
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新AI工具", description = "管理员更新 AI 工具信息")
    public ResponseEntity<AIToolDTO> updateTool(
            @Parameter(description = "工具ID", required = true) @PathVariable Long id,
            @Valid @RequestBody AIToolCreateRequest request) {
        AIToolDTO updatedTool = aiToolService.updateTool(id, request);
        return ResponseEntity.ok(updatedTool);
    }

    /**
     * [管理员接口] 删除 AI 工具
     * DELETE /api/tools/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除AI工具", description = "管理员删除 AI 工具")
    public ResponseEntity<Void> deleteTool(
            @Parameter(description = "工具ID", required = true) @PathVariable Long id) {
        aiToolService.deleteTool(id);
        // 返回 204 No Content
        return ResponseEntity.noContent().build();
    }

    /**
     * [管理员接口] 搜索/过滤工具列表
     * GET /api/tools/admin?search=&type=&active=
     */
    @GetMapping("/admin")
    @Operation(summary = "管理员搜索工具", description = "管理员根据条件搜索/过滤工具列表")
    public ResponseEntity<Page<AIToolDTO>> searchAdminTools(
            @Parameter(description = "搜索关键词") @RequestParam(value = "search", required = false) String search,
            @Parameter(description = "工具类型") @RequestParam(value = "type", required = false) Integer type,
            @Parameter(description = "是否激活") @RequestParam(value = "active", required = false) Boolean active,
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AIToolDTO> tools = aiToolService.searchTools(type, active, search, pageable);
        return ResponseEntity.ok(tools);
    }
}


