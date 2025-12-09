package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.service.ArticleLikeService;
import com.tony.service.tonywuai.service.UserService;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.repository.ArticleLikeRepository;
import com.tony.service.tonywuai.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 文章点赞控制器：处理文章点赞逻辑
 */
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "文章点赞", description = "文章点赞相关接口，包括点赞计数、状态查询、切换点赞等")
public class ArticleLikeController {

    private final ArticleLikeService articleLikeService;
    private final UserService userService;
    private final ArticleRepository articleRepository;
    private final ArticleLikeRepository articleLikeRepository;
    private final UserRepository userRepository;

    /**
     * 辅助方法：从认证主体中获取当前用户ID
     */
    private Long getUserId(UserDetails principal) {
        if (principal == null) {
            throw new RuntimeException("用户未认证");
        }
        return userService.getUserByUsername(principal.getUsername()).getId();
    }

    // --- 公共访问接口 (不需要认证) ---

    /**
     * 获取文章点赞数
     * 路径: GET /api/likes/article/{articleId}/count
     * @param articleId 文章ID
     * @return 点赞总数
     */
    @GetMapping("/article/{articleId}/count")
    @Operation(summary = "获取点赞数", description = "获取指定文章的点赞总数")
    public ResponseEntity<Map<String, Long>> getLikeCount(
            @Parameter(description = "文章ID", required = true) @PathVariable Long articleId) {
        long count = articleLikeService.getLikeCount(articleId);
        return ResponseEntity.ok(Map.of("articleId", articleId, "likeCount", count));
    }

    // --- 管理员统计与详情接口 ---

    /**
     * 点赞统计：按文章分页返回 (articleId, title, likeCount)
     * 路径: GET /api/likes/admin/articles
     */
    @GetMapping("/admin/articles")
    @Operation(summary = "管理员点赞统计", description = "管理员分页获取文章点赞统计信息")
    public ResponseEntity<?> adminListArticles(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "搜索关键词") @RequestParam(required = false) String search
    ) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page), size);
        var all = articleRepository.findAll();
        var filtered = all.stream()
                .filter(a -> search == null || search.isBlank() ||
                        (a.getTitle()!=null && a.getTitle().toLowerCase().contains(search.toLowerCase())))
                .toList();
        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());
        var slice = filtered.subList(start, end);
        var dtoList = slice.stream().map(a -> {
            var map = new java.util.LinkedHashMap<String,Object>();
            map.put("articleId", a.getId());
            map.put("title", a.getTitle());
            map.put("likeCount", articleLikeService.getLikeCount(a.getId()));
            return map;
        }).toList();
        var dtoPage = new org.springframework.data.domain.PageImpl<>(dtoList, pageable, filtered.size());
        return ResponseEntity.ok(dtoPage);
    }

    /**
     * 点赞详情：返回点赞用户列表 (id, username/nickname, createdAt)
     * 路径: GET /api/likes/admin/article/{articleId}/users
     */
    @GetMapping("/admin/article/{articleId}/users")
    @Operation(summary = "管理员点赞详情", description = "管理员获取指定文章的点赞用户列表")
    public ResponseEntity<?> adminArticleLikeUsers(
            @Parameter(description = "文章ID", required = true) @PathVariable Long articleId) {
        var likes = articleLikeRepository.findAllByArticleIdOrderByCreatedAtDesc(articleId);
        var list = likes.stream().map(l -> {
            var map = new java.util.LinkedHashMap<String,Object>();
            map.put("userId", l.getUserId());
            map.put("createdAt", l.getCreatedAt());
            var name = userRepository.findById(l.getUserId())
                    .map(u -> u.getNickname()!=null?u.getNickname():u.getUsername())
                    .orElse(null);
            map.put("name", name);
            return map;
        }).toList();
        return ResponseEntity.ok(list);
    }

    /**
     * 检查当前用户是否已点赞 (需要登录，但如果principal为null则不抛异常，返回isLiked: false)
     * 路径: GET /api/likes/article/{articleId}/status
     * @param articleId 文章ID
     * @param principal 认证主体
     * @return 是否已点赞
     */
    @GetMapping("/article/{articleId}/status")
    @Operation(summary = "检查点赞状态", description = "检查当前登录用户是否已点赞指定文章")
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @Parameter(description = "文章ID", required = true) @PathVariable Long articleId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails principal) {

        boolean isLiked = false;
        if (principal != null) {
            try {
                Long userId = getUserId(principal);
                isLiked = articleLikeService.hasUserLikedArticle(articleId, userId);
            } catch (Exception e) {
                // 用户认证主体存在但获取用户ID失败，仍然返回isLiked: false
            }
        }

        return ResponseEntity.ok(Map.of("articleId", articleId, "isLiked", isLiked));
    }

    // --- 需要认证的接口 (点赞切换) ---

    /**
     * 切换文章点赞状态 (点赞/取消点赞)
     * 路径: POST /api/likes/article/{articleId}/toggle
     * @param articleId 文章ID
     * @param principal 认证主体
     * @return 切换后的状态和最新的点赞数
     */
    @PostMapping("/article/{articleId}/toggle")
    @Operation(summary = "切换点赞状态", description = "登录用户切换文章的点赞状态（点赞/取消）")
    public ResponseEntity<?> toggleLike(
            @Parameter(description = "文章ID", required = true) @PathVariable Long articleId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserDetails principal) {

        try {
            Long userId = getUserId(principal);
            boolean isLiked = articleLikeService.toggleLike(articleId, userId);

            // 重新获取最新的点赞数
            long likeCount = articleLikeService.getLikeCount(articleId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isLiked", isLiked,
                    "likeCount", likeCount,
                    "message", isLiked ? "点赞成功" : "取消点赞成功"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
