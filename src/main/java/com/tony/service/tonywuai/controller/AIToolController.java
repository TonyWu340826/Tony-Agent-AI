package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.AIToolCreateRequest;
import com.tony.service.tonywuai.dto.AIToolDTO;
import com.tony.service.tonywuai.service.AIToolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
public class AIToolController {

    private final AIToolService aiToolService;

    /**
     * [公共/用户接口] 获取所有已激活的 AI 工具列表 (用于前端菜单展示)
     * GET /api/tools/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<AIToolDTO>> getActiveTools(@RequestParam(value = "type", required = false) Integer type) {
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
    public ResponseEntity<AIToolDTO> updateTool(@PathVariable Long id,
                                                @Valid @RequestBody AIToolCreateRequest request) {
        AIToolDTO updatedTool = aiToolService.updateTool(id, request);
        return ResponseEntity.ok(updatedTool);
    }

    /**
     * [管理员接口] 删除 AI 工具
     * DELETE /api/tools/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTool(@PathVariable Long id) {
        aiToolService.deleteTool(id);
        // 返回 204 No Content
        return ResponseEntity.noContent().build();
    }

    /**
     * [管理员接口] 搜索/过滤工具列表
     * GET /api/tools/admin?search=&type=&active=
     */
    @GetMapping("/admin")
    public ResponseEntity<List<AIToolDTO>> searchAdminTools(@RequestParam(value = "search", required = false) String search,
                                                            @RequestParam(value = "type", required = false) Integer type,
                                                            @RequestParam(value = "active", required = false) Boolean active) {
        List<AIToolDTO> tools = aiToolService.searchTools(type, active, search);
        return ResponseEntity.ok(tools);
    }

}

