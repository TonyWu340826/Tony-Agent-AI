package com.tony.service.tonywuai.service;

import com.tony.service.tonywuai.dto.ExamSessionCreateRequest;
import com.tony.service.tonywuai.dto.ExamSessionDTO;
import org.springframework.data.domain.Page;

public interface ExamSessionService {
    ExamSessionDTO create(ExamSessionCreateRequest req);
    void delete(Long id);
    ExamSessionDTO update(Long id, ExamSessionCreateRequest req);
    Page<ExamSessionDTO> search(Long userId, String userName, String subject, Integer grade, String code, String q, Integer status, int page, int size);
}
