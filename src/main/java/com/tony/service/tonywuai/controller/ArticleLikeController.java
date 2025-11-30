package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.service.ArticleLikeService;
import com.tony.service.tonywuai.service.UserService;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.repository.ArticleLikeRepository;
import com.tony.service.tonywuai.repository.UserRepository;
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
    public ResponseEntity<Map<String, Long>> getLikeCount(@PathVariable Long articleId) {
        long count = articleLikeService.getLikeCount(articleId);
        return ResponseEntity.ok(Map.of("articleId", articleId, "likeCount", count));
    }

    // --- 管理员统计与详情接口 ---

    /**
     * 点赞统计：按文章分页返回 (articleId, title, likeCount)
     * 路径: GET /api/likes/admin/articles
     */
    @GetMapping("/admin/articles")
    public ResponseEntity<?> adminListArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
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
    public ResponseEntity<?> adminArticleLikeUsers(@PathVariable Long articleId) {
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
    public ResponseEntity<Map<String, Object>> getLikeStatus(
            @PathVariable Long articleId,
            @AuthenticationPrincipal UserDetails principal) {

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
    public ResponseEntity<?> toggleLike(
            @PathVariable Long articleId,
            @AuthenticationPrincipal UserDetails principal) {

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
