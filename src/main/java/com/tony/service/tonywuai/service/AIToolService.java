package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.AIToolCreateRequest;
import com.tony.service.tonywuai.dto.AIToolDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * AI 工具业务服务接口 (面向管理员和用户)
 */
public interface AIToolService {

    /**
     * 获取所有已激活的 AI 工具 (面向用户和前端菜单)
     * @return 已激活的 AI 工具DTO列表
     */
    List<AIToolDTO> getActiveTools();

    /**
     * 管理员创建新的 AI 工具
     * @param request 创建请求
     * @return 创建成功的工具DTO
     */
    AIToolDTO createTool(AIToolCreateRequest request);

    /**
     * 管理员更新 AI 工具信息
     * @param id 工具ID
     * @param request 更新请求
     * @return 更新后的工具DTO
     */
    AIToolDTO updateTool(Long id, AIToolCreateRequest request);

    /**
     * 管理员删除 AI 工具 (物理删除)
     * @param id 工具ID
     */
    void deleteTool(Long id);

    List<AIToolDTO> searchTools(Integer type, Boolean active, String q);

    Page<AIToolDTO> searchTools(Integer type, Boolean active, String q, Pageable pageable);
}
