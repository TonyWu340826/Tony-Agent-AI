package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.CategoryCreateRequest;
import com.tony.service.tonywuai.dto.CategoryNodeDTO;
import com.tony.service.tonywuai.dto.CategoryUpdateRequest;
import com.tony.service.tonywuai.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface CategoryService {
    Category create(CategoryCreateRequest req);
    Category update(Long id, CategoryUpdateRequest req);
    void delete(Long id);
    Page<Category> list(Pageable pageable, String search, Integer type, Long parentId, Integer maxType);
    Category get(Long id);
    List<CategoryNodeDTO> tree(Integer type);
}
