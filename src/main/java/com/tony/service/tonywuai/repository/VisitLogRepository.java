package com.tony.service.tonywuai.repository;

import com.tony.service.tonywuai.entity.VisitLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;

@Repository
public interface VisitLogRepository extends JpaRepository<VisitLog, Long> {
    long countByVisitDay(Date day);
    Page<VisitLog> findByVisitDayOrderByCreatedAtDesc(Date day, Pageable pageable);

    @Query(value = "select count(*) from t_visit_log where (visit_day is not null and date(visit_day)=:day) or (visit_day is null and date(created_at)=:day)", nativeQuery = true)
    long countToday(@Param("day") Date day);

    @Query(value = "select * from t_visit_log where (visit_day is not null and date(visit_day)=:day) or (visit_day is null and date(created_at)=:day) order by created_at desc",
           countQuery = "select count(*) from t_visit_log where (visit_day is not null and date(visit_day)=:day) or (visit_day is null and date(created_at)=:day)",
           nativeQuery = true)
    Page<VisitLog> findToday(@Param("day") Date day, Pageable pageable);
}
