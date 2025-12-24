package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.dto.AIToolCreateRequest;
import com.tony.service.tonywuai.dto.AIToolDTO;
import com.tony.service.tonywuai.entity.AITool;
import com.tony.service.tonywuai.repository.AIToolRepository;
import com.tony.service.tonywuai.service.AIToolService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AI 工具业务服务实现类
 */
@Service
@RequiredArgsConstructor
public class AIToolServiceImpl implements AIToolService {

    private final AIToolRepository aiToolRepository;

    /**
     * 辅助方法：将 AITool 实体转换为 DTO
     */
    private AIToolDTO convertToDTO(AITool tool) {
        AIToolDTO dto = new AIToolDTO();
        dto.setId(tool.getId());
        dto.setToolName(tool.getToolName());
        dto.setDescription(tool.getDescription());
        dto.setApiPath(tool.getApiPath());
        dto.setIconUrl(tool.getIconUrl());
        dto.setIsActive(tool.getIsActive());
        dto.setType(tool.getType());
        dto.setVipAllow(tool.getVipAllow());
        dto.setLinkType(tool.getLinkType());
        return dto;
    }

    /**
     * 获取所有已激活的 AI 工具 (面向用户)
     */
    @Override
    @Transactional(readOnly = true)
    public List<AIToolDTO> getActiveTools() {
        List<AITool> activeTools = aiToolRepository.findAllByIsActiveOrderByToolNameAsc(true);
        return activeTools.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 管理员创建新的 AI 工具
     */
    @Override
    @Transactional
    public AIToolDTO createTool(AIToolCreateRequest request) {
        AITool tool = new AITool();
        tool.setToolName(request.getToolName());
        tool.setDescription(request.getDescription());
        tool.setApiPath(request.getApiPath());
        tool.setIconUrl(request.getIconUrl());
        tool.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        tool.setType(request.getType() != null ? request.getType() : 1);
        tool.setVipAllow(request.getVipAllow());
        tool.setLinkType(request.getLinkType());

        AITool savedTool = aiToolRepository.save(tool);
        return convertToDTO(savedTool);
    }

    /**
     * 管理员更新 AI 工具信息
     */
    @Override
    @Transactional
    public AIToolDTO updateTool(Long id, AIToolCreateRequest request) {
        AITool tool = aiToolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AI 工具ID不存在: " + id));

        // 更新字段
        tool.setToolName(request.getToolName());
        tool.setDescription(request.getDescription());
        tool.setApiPath(request.getApiPath());
        tool.setIconUrl(request.getIconUrl());
        tool.setIsActive(request.getIsActive() != null ? request.getIsActive() : tool.getIsActive());
        tool.setType(request.getType() != null ? request.getType() : tool.getType());
        tool.setVipAllow(request.getVipAllow() != null ? request.getVipAllow() : tool.getVipAllow());
        tool.setLinkType(request.getLinkType() != null ? request.getLinkType() : tool.getLinkType());

        AITool updatedTool = aiToolRepository.save(tool);
        return convertToDTO(updatedTool);
    }

    /**
     * 管理员删除 AI 工具
     */
    @Override
    @Transactional
    public void deleteTool(Long id) {
        if (!aiToolRepository.existsById(id)) {
            throw new RuntimeException("AI 工具ID不存在: " + id);
        }
        aiToolRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AIToolDTO> searchTools(Integer type, Boolean active, String q) {
        List<AITool> list = aiToolRepository.search(type, active, (q == null || q.isBlank()) ? null : q.trim());
        return list.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AIToolDTO> searchTools(Integer type, Boolean active, String q, Pageable pageable) {
        Page<AITool> page = aiToolRepository.search(type, active, (q == null || q.isBlank()) ? null : q.trim(), pageable);
        return page.map(this::convertToDTO);
    }
}
