package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.StudentExamRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentExamRecordRepository extends JpaRepository<StudentExamRecord, Long> {

    @Query("select coalesce(avg(1.0* r.correctCount / nullif(r.totalQuestions,0)),0) from StudentExamRecord r where (:grade is null or r.grade = :grade) and (:subject is null or r.subject = :subject)")
    Double avgAccuracy(@Param("grade") Integer grade, @Param("subject") String subject);

    @Query("select count(r) from StudentExamRecord r where (:grade is null or r.grade = :grade) and (:subject is null or r.subject = :subject)")
    Long recordCount(@Param("grade") Integer grade, @Param("subject") String subject);
}

