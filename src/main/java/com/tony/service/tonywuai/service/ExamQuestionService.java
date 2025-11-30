package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.ExamQuestionCreateRequest;
import com.tony.service.tonywuai.dto.ExamQuestionDTO;
import org.springframework.data.domain.Page;

public interface ExamQuestionService {
    ExamQuestionDTO create(ExamQuestionCreateRequest req);
    ExamQuestionDTO update(Long id, ExamQuestionCreateRequest req);
    void delete(Long id);
    ExamQuestionDTO get(Long id);
    Page<ExamQuestionDTO> search(String subject, Integer grade, String type, String tag, String q, int page, int size);
    java.util.List<ExamQuestionDTO> listByIds(java.util.List<Long> ids);
}
