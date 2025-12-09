package com.tony.service.tonywuai.controller;
import com.tony.service.tonywuai.dto.ArticleCreateRequest;
import com.tony.service.tonywuai.dto.ArticleDTO;
import com.tony.service.tonywuai.dto.ArticleUpdateRequest;
import com.tony.service.tonywuai.entity.Article;
import com.tony.service.tonywuai.service.ArticleService;
import com.tony.service.tonywuai.repository.ArticleRepository;
import com.tony.service.tonywuai.com.ArticleStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 文章控制器：处理文章的创建、读取、更新和删除
 */
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Tag(name = "文章管理", description = "文章的增删改查、发布、下架等接口")
public class ArticleController {

    private final ArticleService articleService;
    private final ArticleRepository articleRepository;

    // --- 公共访问接口 (不需要认证) ---

    /**
     * 获取已发布的文章列表 (分页)
     * 路径: GET /api/articles?page=0&size=10
     * @param page 页码 (默认 0)
     * @param size 每页大小 (默认 10)
     * @return 文章分页列表
     */
    @GetMapping(params = {"page", "size"})
    @Operation(summary = "获取已发布文章", description = "分页获取所有已发布的文章列表")
    public ResponseEntity<Page<ArticleDTO>> getPublishedArticles(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {

        Page<ArticleDTO> articles = articleService.getPublishedArticles(page, size);
        return ResponseEntity.ok(articles);
    }



    /**
     * 根据文章ID查文章详情
     * @param id
     * @return
     */
    @GetMapping(params = "id")
    @Operation(summary = "根据ID获取文章", description = "根据ID获取已发布的文章详情")
    public ResponseEntity<?> getPublishedArticlesById(
            @Parameter(description = "文章ID", required = true) @RequestParam Long id) {
        Optional<Article> optional = articleRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "文章未找到: " + id));
        }
        Article article = optional.get();
        return ResponseEntity.ok(toDTO(article));
    }

    @GetMapping("/{id:\\d+}")
    @Operation(summary = "根据路径ID获取文章", description = "通过路径参数获取已发布的文章详情")
    public ResponseEntity<?> getArticleDetailByIdPath(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id) {
        Optional<Article> optional = articleRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "文章未找到: " + id));
        }
        Article article = optional.get();
        return ResponseEntity.ok(toDTO(article));
    }

    /**
     * 根据 slug 获取已发布的文章详情
     * 路径: GET /api/articles/{slug}
     * @param slug 文章 URL 别名
     * @return 文章详情
     */
    @GetMapping("/{slug}")
    @Operation(summary = "根据Slug获取文章", description = "根据URL别名(Slug)获取已发布的文章详情")
    public ResponseEntity<?> getArticleDetail(
            @Parameter(description = "文章别名", required = true) @PathVariable String slug) {
        try {
            ArticleDTO article = articleService.getPublishedArticleDetail(slug);
            return ResponseEntity.ok(article);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // --- 管理员操作接口 (需要认证，由 Spring Security 拦截) ---

    /**
     * 创建新文章
     * 路径: POST /api/articles
     * @param request 创建请求 DTO
     * @return 创建成功的文章
     */
    @PostMapping
    @Operation(summary = "创建文章", description = "管理员创建新的文章")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleCreateRequest request) {
        try {
            Article newArticle = articleService.createArticle(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 更新文章
     * 路径: PUT /api/articles/{id}
     * @param id 文章ID
     * @param request 更新请求 DTO
     * @return 更新后的文章
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新文章", description = "管理员更新文章内容")
    public ResponseEntity<?> updateArticle(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id, 
            @Valid @RequestBody ArticleUpdateRequest request) {
        try {
            Article updatedArticle = articleService.updateArticle(id, request);
            return ResponseEntity.ok(updatedArticle);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 删除文章
     * 路径: DELETE /api/articles/{id}
     * @param id 文章ID
     * @return 成功信息
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除文章", description = "管理员删除文章")
    public ResponseEntity<?> deleteArticle(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "文章删除成功"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 管理员：分页获取全部文章（包含草稿与已发布），支持标题/摘要/slug 搜索
     * 路径: GET /api/articles/admin?page=0&size=10&search=xxx
     */
    @GetMapping("/admin")
    @Operation(summary = "管理员文章列表", description = "管理员分页获取所有文章（含草稿），支持关键词搜索")
    public ResponseEntity<Page<ArticleDTO>> adminListArticles(
            @Parameter(description = "页码 (0开始)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "搜索关键词") @RequestParam Optional<String> search
    ) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size);

        if (search.isPresent() && !search.get().isBlank()) {
            String term = search.get().toLowerCase();
            List<Article> all = articleRepository.findAll();
            List<Article> filtered = all.stream()
                    .filter(a -> (a.getTitle() != null && a.getTitle().toLowerCase().contains(term))
                            || (a.getSummary() != null && a.getSummary().toLowerCase().contains(term))
                            || (a.getSlug() != null && a.getSlug().toLowerCase().contains(term)))
                    .collect(Collectors.toList());

            int start = Math.min(page * size, filtered.size());
            int end = Math.min(start + size, filtered.size());
            List<ArticleDTO> pageContent = filtered.subList(start, end).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());

            Page<ArticleDTO> dtoPage = new PageImpl<>(pageContent, pageable, filtered.size());
            return ResponseEntity.ok(dtoPage);
        }

        Page<Article> articlePage = articleRepository.findAll(pageable);
        Page<ArticleDTO> dtoPage = articlePage.map(this::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    /**
     * 管理员：查询文章详情（任意状态）
     * 路径: GET /api/articles/admin/{id}
     */
    @GetMapping("/admin/{id}")
    @Operation(summary = "管理员获取文章详情", description = "管理员获取任意状态的文章详情")
    public ResponseEntity<?> adminGetDetail(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id) {
        Optional<Article> opt = articleRepository.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(toDTO(opt.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "文章未找到: " + id));
    }
    /**
     * 管理员：发布文章
     * 路径: PUT /api/articles/{id}/publish
     */
    @PutMapping("/{id}/publish")
    @Operation(summary = "发布文章", description = "将文章状态修改为已发布")
    public ResponseEntity<?> publishArticle(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id) {
        Optional<Article> optional = articleRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "文章未找到: " + id));
        }
        Article article = optional.get();
        article.setStatus(ArticleStatus.PUBLISHED);
        Article saved = articleRepository.save(article);
        return ResponseEntity.ok(toDTO(saved));
    }

    /**
     * 管理员：下架文章（改为草稿）
     * 路径: PUT /api/articles/{id}/unpublish
     */
    @PutMapping("/{id}/unpublish")
    @Operation(summary = "下架文章", description = "将文章状态修改为草稿")
    public ResponseEntity<?> unpublishArticle(
            @Parameter(description = "文章ID", required = true) @PathVariable Long id) {
        Optional<Article> optional = articleRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "文章未找到: " + id));
        }
        Article article = optional.get();
        article.setStatus(ArticleStatus.DRAFT);
        Article saved = articleRepository.save(article);
        return ResponseEntity.ok(toDTO(saved));
    }

    private ArticleDTO toDTO(Article a) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setSlug(a.getSlug());
        dto.setSummary(a.getSummary());
        dto.setContent(a.getContent());
        dto.setAuthorName(a.getAuthorName());
        dto.setViews(a.getViews());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setStatus(a.getStatus() != null ? a.getStatus().name() : "DRAFT");
        return dto;
    }
}
