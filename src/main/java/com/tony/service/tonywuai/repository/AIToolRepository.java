package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.AITool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * AI 工具数据访问层
 */
@Repository
public interface AIToolRepository extends JpaRepository<AITool, Long> {

    /**
     * 查询所有已激活的 AI 工具，通常用于前端展示菜单
     * @param isActive 是否激活
     * @return 已激活的 AI 工具列表
     */
    List<AITool> findAllByIsActiveOrderByToolNameAsc(Boolean isActive);

    @Query("select t from AITool t where (:type is null or t.type = :type) and (:active is null or t.isActive = :active) and ( :q is null or lower(t.toolName) like lower(concat('%', :q, '%')) or lower(t.description) like lower(concat('%', :q, '%')) or lower(t.apiPath) like lower(concat('%', :q, '%')) ) order by t.toolName asc")
    List<AITool> search(@Param("type") Integer type, @Param("active") Boolean active, @Param("q") String q);
}
