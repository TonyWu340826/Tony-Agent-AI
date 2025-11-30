package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.ExamQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {

  @Query("select q from ExamQuestion q where (:subject is null or q.subject = :subject) and (:grade is null or q.grade = :grade) and (:type is null or q.type = :type) and (:tag is null or (q.knowledgeTags is not null and lower(q.knowledgeTags) like lower(concat('%', :tag, '%')))) and (:search is null or lower(q.content) like lower(concat('%', :search, '%'))) order by q.num asc, q.id asc")
  Page<ExamQuestion> search(
            @Param("subject") String subject,
            @Param("grade") Integer grade,
            @Param("type") String type,
            @Param("tag") String tag,
            @Param("search") String search,
            Pageable pageable);

  @Query("select q from ExamQuestion q where q.id in :ids order by q.num asc, q.id asc")
  java.util.List<ExamQuestion> findAllByIdInOrderByNumAscIdAsc(@Param("ids") java.util.List<Long> ids);
}
