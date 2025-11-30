package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.InterviewItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewItemRepository extends JpaRepository<InterviewItem, Long> {
    List<InterviewItem> findAllByIsDeletedFalseOrderByCreatedAtDesc();
}

