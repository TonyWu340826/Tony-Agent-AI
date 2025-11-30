package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.ExamSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
  @Query("select s from ExamSession s where (:userId is null or s.userId = :userId) and (:userName is null or lower(s.userName) like lower(concat('%', :userName, '%'))) and (:subject is null or s.subject = :subject) and (:grade is null or s.grade = :grade) and (:code is null or s.code = :code) and (:status is null or s.status = :status) and (:q is null or lower(s.paperName) like lower(concat('%', :q, '%'))) order by s.createdAt desc")
  Page<ExamSession> search(@Param("userId") Long userId,
                           @Param("userName") String userName,
                           @Param("subject") String subject,
                           @Param("grade") Integer grade,
                           @Param("code") String code,
                           @Param("status") Integer status,
                           @Param("q") String q,
                           Pageable pageable);

  Page<ExamSession> findByUserNameContainingIgnoreCaseAndStatus(String userName, Integer status, Pageable pageable);
}
