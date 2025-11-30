package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.GuestMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestMessageRepository extends JpaRepository<GuestMessage, Long> {

    List<GuestMessage> findByIsDeletedFalseOrderByCreatedAtDesc();

    @Query(value = "SELECT g.* FROM t_guest_message g " +
            "WHERE g.is_deleted = false AND (" +
            " LOWER(COALESCE(g.nickname, '')) LIKE LOWER(CONCAT('%', :q, '%')) " +
            " OR LOWER(COALESCE(g.email, '')) LIKE LOWER(CONCAT('%', :q, '%')) " +
            " OR LOWER(COALESCE(g.content, '')) LIKE LOWER(CONCAT('%', :q, '%')) ) " +
            "ORDER BY g.created_at DESC",
            nativeQuery = true)
    List<GuestMessage> search(@Param("q") String q);
}
