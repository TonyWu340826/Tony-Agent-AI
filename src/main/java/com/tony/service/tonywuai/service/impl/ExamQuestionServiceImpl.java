package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.dto.ExamQuestionCreateRequest;
import com.tony.service.tonywuai.dto.ExamQuestionDTO;
import com.tony.service.tonywuai.entity.ExamQuestion;
import com.tony.service.tonywuai.repository.ExamQuestionRepository;
import com.tony.service.tonywuai.service.ExamQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamQuestionServiceImpl implements ExamQuestionService {

    private final ExamQuestionRepository repo;

    private ExamQuestionDTO toDTO(ExamQuestion q) {
        ExamQuestionDTO dto = new ExamQuestionDTO();
        dto.setId(q.getId()); dto.setSubject(q.getSubject()); dto.setGrade(q.getGrade()); dto.setType(q.getType());
        dto.setContent(q.getContent()); dto.setOptionsJson(q.getOptionsJson()); dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setExplanation(q.getExplanation()); dto.setKnowledgeTags(q.getKnowledgeTags()); dto.setNum(q.getNum()); dto.setCreatedAt(q.getCreatedAt()); dto.setUpdatedAt(q.getUpdatedAt());
        return dto;
    }

    @Override
    @Transactional
    public ExamQuestionDTO create(ExamQuestionCreateRequest r) {
        ExamQuestion q = new ExamQuestion();
        q.setSubject(r.getSubject()); q.setGrade(r.getGrade()); q.setType(r.getType()); q.setContent(r.getContent());
        q.setOptionsJson(r.getOptionsJson()); q.setCorrectAnswer(r.getCorrectAnswer()); q.setExplanation(r.getExplanation()); q.setNum(r.getNum()!=null? r.getNum():0);
        q.setKnowledgeTags(r.getKnowledgeTags());
        return toDTO(repo.save(q));
    }

    @Override
    @Transactional
    public ExamQuestionDTO update(Long id, ExamQuestionCreateRequest r) {
        ExamQuestion q = repo.findById(id).orElseThrow(() -> new RuntimeException("题目不存在: " + id));
        q.setSubject(r.getSubject()); q.setGrade(r.getGrade()); q.setType(r.getType()); q.setContent(r.getContent());
        q.setOptionsJson(r.getOptionsJson()); q.setCorrectAnswer(r.getCorrectAnswer()); q.setExplanation(r.getExplanation());
        if (r.getNum()!=null) q.setNum(r.getNum());
        q.setKnowledgeTags(r.getKnowledgeTags());
        return toDTO(repo.save(q));
    }

    @Override
    @Transactional
    public void delete(Long id) { if (!repo.existsById(id)) { throw new RuntimeException("题目不存在: " + id); } repo.deleteById(id); }

    @Override
    @Transactional(readOnly = true)
    public ExamQuestionDTO get(Long id) { return repo.findById(id).map(this::toDTO).orElseThrow(() -> new RuntimeException("题目不存在: " + id)); }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamQuestionDTO> search(String subject, Integer grade, String type, String tag, String search, int page, int size) {
        PageRequest pr = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<ExamQuestion> p = repo.search(emptyToNull(subject), grade, emptyToNull(type), emptyToNull(tag), emptyToNull(search), pr);
        return new PageImpl<>(p.getContent().stream().map(this::toDTO).collect(Collectors.toList()), pr, p.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<ExamQuestionDTO> listByIds(java.util.List<Long> ids) {
        if (ids == null || ids.isEmpty()) return java.util.List.of();
        return repo.findAllByIdInOrderByNumAscIdAsc(ids).stream().map(this::toDTO).collect(Collectors.toList());
    }

    private String emptyToNull(String s) { return (s == null || s.trim().isEmpty()) ? null : s.trim(); }
}
