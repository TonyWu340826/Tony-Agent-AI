package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.entity.GuestMessage;
import com.tony.service.tonywuai.entity.User;
import com.tony.service.tonywuai.repository.GuestMessageRepository;
import com.tony.service.tonywuai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "留言管理", description = "系统留言板管理接口")
public class GuestMessageController {

    private final GuestMessageRepository guestMessageRepository;
    private final UserService userService;

    // 公共接口：用户留言
    @PostMapping("/messages")
    @Operation(summary = "用户留言", description = "VIP用户提交留言")
    public ResponseEntity<?> createMessage(
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails principal, 
            @RequestBody Map<String, String> req) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "请先登录"));
        }
        User user = userService.getUserByUsername(principal.getUsername());
        if (user.getVipLevel() == null || user.getVipLevel() != 99) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", "仅VIP99可留言"));
        }
        String content = req.getOrDefault("content", "");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "内容不能为空"));
        }
        GuestMessage m = new GuestMessage();
        m.setContent(content.trim());
        m.setNickname(req.getOrDefault("nickname", null));
        m.setEmail(req.getOrDefault("email", null));
        m.setUserId(user.getId());
        m.setIsDeleted(false);
        GuestMessage saved = guestMessageRepository.save(m);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "id", saved.getId()));
    }

    // 管理员：分页列表（简化为一次性返回，前端自行分页）
    @GetMapping("/admin/messages")
    @Operation(summary = "留言列表", description = "管理员查询留言列表")
    public ResponseEntity<?> adminList(
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search) {
        List<GuestMessage> all = (search==null || search.trim().isEmpty())
                ? guestMessageRepository.findByIsDeletedFalseOrderByCreatedAtDesc()
                : guestMessageRepository.search(search.trim());
        List<Map<String,Object>> res = all.stream().map(g -> {
            java.util.Map<String,Object> m = new java.util.LinkedHashMap<>();
            m.put("id", g.getId());
            m.put("nickname", g.getNickname());
            m.put("email", g.getEmail());
            m.put("content", g.getContent());
            m.put("reply", g.getReply());
            m.put("createdAt", g.getCreatedAt());
            m.put("updatedAt", g.getUpdatedAt());
            m.put("repliedAt", g.getRepliedAt());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    // 管理员：回复留言
    @PutMapping("/admin/messages/{id}/reply")
    @Operation(summary = "回复留言", description = "管理员回复用户留言")
    public ResponseEntity<?> adminReply(
            @Parameter(description = "留言ID") @PathVariable Long id, 
            @RequestBody Map<String, String> req) {
        GuestMessage g = guestMessageRepository.findById(id).orElse(null);
        if (g == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "未找到"));
        g.setReply(req.getOrDefault("reply", ""));
        g.setRepliedAt(LocalDateTime.now());
        guestMessageRepository.save(g);
        return ResponseEntity.ok(Map.of("success", true));
    }

    // 管理员：删除留言
    @DeleteMapping("/admin/messages/{id}")
    @Operation(summary = "删除留言", description = "管理员删除留言")
    public ResponseEntity<?> adminDelete(
            @Parameter(description = "留言ID") @PathVariable Long id) {
        GuestMessage g = guestMessageRepository.findById(id).orElse(null);
        if (g == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "未找到"));
        g.setIsDeleted(true);
        guestMessageRepository.save(g);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
