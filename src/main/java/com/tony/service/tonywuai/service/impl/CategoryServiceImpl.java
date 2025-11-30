package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.dto.CategoryCreateRequest;
import com.tony.service.tonywuai.dto.CategoryNodeDTO;
import com.tony.service.tonywuai.dto.CategoryUpdateRequest;
import com.tony.service.tonywuai.entity.Category;
import com.tony.service.tonywuai.repository.CategoryRepository;
import com.tony.service.tonywuai.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private int resolveLevel(Long parentId) {
        if (parentId == null) return 1;
        Category p = categoryRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("父级分类不存在: " + parentId));
        if (p.getLevel() >= 3) throw new RuntimeException("最多支持三级分类");
        return p.getLevel() + 1;
    }

    @Override
    @Transactional
    public Category create(CategoryCreateRequest req) {
        if (req.getName() == null || req.getName().isBlank()) throw new RuntimeException("分类名称不能为空");
        categoryRepository.findByNameAndParentId(req.getName(), req.getParentId())
                .ifPresent(c -> { throw new RuntimeException("同级已存在该名称"); });
        Category c = new Category();
        c.setName(req.getName().trim());
        c.setParentId(req.getParentId());
        c.setLevel(resolveLevel(req.getParentId()));
        c.setType(req.getType() != null ? req.getType() : 1);
        return categoryRepository.save(c);
    }

    @Override
    @Transactional
    public Category update(Long id, CategoryUpdateRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("分类不存在: " + id));
        if (req.getName() != null && !req.getName().isBlank()) {
            c.setName(req.getName().trim());
        }
        if (req.getParentId() != null || c.getParentId() != null) {
            Long newParent = req.getParentId();
            c.setParentId(newParent);
            c.setLevel(resolveLevel(newParent));
        }
        if (req.getType() != null) {
            c.setType(req.getType());
        }
        return categoryRepository.save(c);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        // 不允许有子节点时删除
        List<Category> children = categoryRepository.findAllByParentIdOrderByNameAsc(id);
        if (!children.isEmpty()) throw new RuntimeException("请先删除子分类");
        categoryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Category> list(Pageable pageable, String search, Integer type) {
        List<Category> all = categoryRepository.findAll();
        List<Category> filtered = all;
        if (search != null && !search.isBlank()) {
            String kw = search.toLowerCase();
            filtered = filtered.stream()
                    .filter(c -> c.getName() != null && c.getName().toLowerCase().contains(kw))
                    .collect(Collectors.toList());
        }
        if (type != null) {
            filtered = filtered.stream()
                    .filter(c -> c.getType() != null && c.getType().equals(type))
                    .collect(Collectors.toList());
        }

        int total = filtered.size();
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), total);
        List<Category> content = start < end ? filtered.subList(start, end) : new ArrayList<>();
        return new org.springframework.data.domain.PageImpl<>(content, pageable, total);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryNodeDTO> tree(Integer type) {
        List<Category> all = categoryRepository.findAll();
        if (type != null) {
            all = all.stream().filter(c -> c.getType() != null && c.getType().equals(type)).collect(Collectors.toList());
        }
        Map<Long, List<Category>> byParent = all.stream()
                .collect(Collectors.groupingBy(c -> c.getParentId() == null ? 0L : c.getParentId()));

        List<Category> roots = byParent.getOrDefault(0L, new ArrayList<>());

        return roots.stream().map(r -> toNode(r, byParent)).collect(Collectors.toList());
    }

    private CategoryNodeDTO toNode(Category c, Map<Long, List<Category>> byParent) {
        CategoryNodeDTO n = new CategoryNodeDTO();
        n.setId(c.getId());
        n.setName(c.getName());
        n.setLevel(c.getLevel());
        n.setType(c.getType());
        List<Category> children = byParent.getOrDefault(c.getId(), new ArrayList<>());
        if (!children.isEmpty()) {
            n.setChildren(children.stream().map(ch -> toNode(ch, byParent)).collect(Collectors.toList()));
        } else {
            n.setChildren(new ArrayList<>());
        }
        return n;
    }
}
