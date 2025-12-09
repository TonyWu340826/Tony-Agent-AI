package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.CommentCreateRequest;
import com.tony.service.tonywuai.dto.CommentDTO;
import com.tony.service.tonywuai.entity.Comment;
import com.tony.service.tonywuai.service.CommentService;
import com.tony.service.tonywuai.service.UserService;
import com.tony.service.tonywuai.repository.CommentRepository;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * 评论控制器：处理文章评论的增删查
 */
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "评论管理", description = "评论的发布、查询、删除等接口")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;
    private final CommentRepository commentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    /**
     * 辅助方法：从认证主体中获取当前用户ID
     */
    private Long getUserId(UserDetails principal) {
        if (principal == null) {
            throw new RuntimeException("用户未认证");
        }
        // 根据 username 查找用户实体，然后获取 ID。
        return userService.getUserByUsername(principal.getUsername()).getId();
    }

    // --- 公共访问接口 (不需要认证) ---

    /**
     * 获取某一文章的所有评论 (嵌套结构)
     * 路径: GET /api/comments/article/{articleId}
     * @param articleId 文章ID
     * @return 评论树列表
     */
    @GetMapping("/article/{articleId}")
    @Operation(summary = "获取文章评论", description = "获取指定文章的所有评论（嵌套结构）")
    public ResponseEntity<?> getCommentsByArticleId(
            @Parameter(description = "文章ID", required = true) @PathVariable Long articleId) {
        try {
            List<CommentDTO> comments = commentService.getCommentsByArticleId(articleId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- 需要认证的接口 (创建和删除) ---

    /**
     * 发表评论或回复
     * 路径: POST /api/comments
     * @param request 评论创建请求 DTO
     * @param principal 认证主体
     * @return 创建成功的评论实体
     */
    @PostMapping
    @Operation(summary = "发表评论", description = "登录用户发表评论或回复")
    public ResponseEntity<?> createComment(
            @Valid @RequestBody CommentCreateRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails principal) {

        try {
            Long userId = getUserId(principal);
            Comment newComment = commentService.createComment(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- 管理员接口：评论列表与删除 ---

    @GetMapping("/admin")
    @Operation(summary = "管理员评论列表", description = "管理员分页获取所有评论，支持搜索和筛选")
    public ResponseEntity<?> adminList(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "文章ID筛选") @RequestParam(required = false) Long articleId,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search
    ) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), size);
        var all = commentRepository.findAll();
        var filtered = all.stream()
                .filter(c -> !Boolean.TRUE.equals(c.getIsDeleted()))
                .filter(c -> articleId == null || c.getArticleId().equals(articleId))
                .filter(c -> (search == null || search.isBlank()) || (c.getContent() != null && c.getContent().toLowerCase().contains(search.toLowerCase())))
                .sorted((a,b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .toList();

        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        var pageSlice = filtered.subList(start, end);

        // 映射为轻量 DTO
        var dtoList = pageSlice.stream().map(c -> {
            var map = new java.util.LinkedHashMap<String,Object>();
            map.put("id", c.getId());
            map.put("articleId", c.getArticleId());
            map.put("userId", c.getUserId());
            map.put("content", c.getContent());
            map.put("parentId", c.getParentId());
            map.put("createdAt", c.getCreatedAt());
            map.put("articleTitle", articleRepository.findById(c.getArticleId()).map(a->a.getTitle()).orElse(null));
            map.put("authorName", userRepository.findById(c.getUserId()).map(u -> u.getNickname()!=null?u.getNickname():u.getUsername()).orElse(null));
            return map;
        }).toList();

        var dtoPage = new org.springframework.data.domain.PageImpl<>(dtoList, pageable, filtered.size());
        return ResponseEntity.ok(dtoPage);
    }

    @DeleteMapping("/admin/{id}")
    @Operation(summary = "管理员删除评论", description = "管理员逻辑删除指定评论")
    public ResponseEntity<?> adminDelete(
            @Parameter(description = "评论ID", required = true) @PathVariable Long id) {
        var comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "评论未找到: " + id));
        }
        comment.setIsDeleted(true);
        commentRepository.save(comment);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * 删除评论 (仅限评论者本人或管理员)
     * 路径: DELETE /api/comments/{commentId}
     * @param commentId 评论ID
     * @param principal 认证主体
     * @return 成功信息
     */
    @DeleteMapping("/{commentId}")
    @Operation(summary = "删除评论", description = "用户删除自己的评论（或管理员操作）")
    public ResponseEntity<?> deleteComment(
            @Parameter(description = "评论ID", required = true) @PathVariable Long commentId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails principal) {

        try {
            Long userId = getUserId(principal);
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "评论删除成功"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
