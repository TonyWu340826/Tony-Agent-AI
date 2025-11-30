package com.tony.service.tonywuai.service.impl;

import com.tony.service.tonywuai.dto.ExamSessionCreateRequest;
import com.tony.service.tonywuai.dto.ExamSessionDTO;
import com.tony.service.tonywuai.entity.ExamSession;
import com.tony.service.tonywuai.repository.ExamSessionRepository;
import com.tony.service.tonywuai.service.ExamSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamSessionServiceImpl implements ExamSessionService {

    private final ExamSessionRepository repo;

    private ExamSessionDTO toDTO(ExamSession s){
        ExamSessionDTO d = new ExamSessionDTO();
        d.setId(s.getId()); d.setUserId(s.getUserId()); d.setUserName(s.getUserName()); d.setPaperName(s.getPaperName()); d.setSubject(s.getSubject()); d.setGrade(s.getGrade());
        d.setQuestionIds(s.getQuestionIds()); d.setScore(s.getScore()); d.setCorrectNum(s.getCorrectNum()); d.setWrongNum(s.getWrongNum());
        d.setAnswerDetailsJson(s.getAnswerDetailsJson()); d.setAiSummary(s.getAiSummary()); d.setStartTime(s.getStartTime()); d.setEndTime(s.getEndTime()); d.setCreatedAt(s.getCreatedAt());
        d.setStatus(s.getStatus()); d.setCode(s.getCode());
        return d;
    }

    @Override
    @Transactional
    public ExamSessionDTO create(ExamSessionCreateRequest req) {
        ExamSession s = new ExamSession();
        s.setUserId(req.getUserId());
        s.setUserName(req.getUserName());
        s.setPaperName(req.getPaperName());
        s.setSubject(req.getSubject());
        s.setGrade(req.getGrade());
        s.setQuestionIds(req.getQuestionIds());
        try { s.setScore(req.getScore()!=null? new BigDecimal(req.getScore()) : null); } catch(Exception ignored){}
        s.setCorrectNum(req.getCorrectNum()!=null? req.getCorrectNum():0);
        s.setWrongNum(req.getWrongNum()!=null? req.getWrongNum():0);
        s.setAnswerDetailsJson(req.getAnswerDetailsJson());
        s.setAiSummary(req.getAiSummary());
        s.setStatus(req.getStatus()!=null? req.getStatus():0);
        String code = req.getCode();
        if (code==null || code.isBlank()) {
            code = String.valueOf(System.currentTimeMillis());
            if (code.length()>20) code = code.substring(code.length()-20);
        }
        s.setCode(code);
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try { if (req.getStartTime()!=null) s.setStartTime(fmt.parse(req.getStartTime())); } catch(ParseException ignored){}
        try { if (req.getEndTime()!=null) s.setEndTime(fmt.parse(req.getEndTime())); } catch(ParseException ignored){}
        return toDTO(repo.save(s));
    }

    @Override
    @Transactional
    public void delete(Long id) { if (!repo.existsById(id)) { throw new RuntimeException("记录不存在: "+id);} repo.deleteById(id); }

    @Override
    @Transactional
    public ExamSessionDTO update(Long id, ExamSessionCreateRequest req) {
        ExamSession s = repo.findById(id).orElseThrow(() -> new RuntimeException("记录不存在: "+id));
        if (req.getPaperName()!=null) s.setPaperName(req.getPaperName());
        if (req.getSubject()!=null) s.setSubject(req.getSubject());
        if (req.getGrade()!=null) s.setGrade(req.getGrade());
        if (req.getQuestionIds()!=null) s.setQuestionIds(req.getQuestionIds());
        try { if (req.getScore()!=null) s.setScore(new BigDecimal(req.getScore())); } catch(Exception ignored){}
        if (req.getCorrectNum()!=null) s.setCorrectNum(req.getCorrectNum());
        if (req.getWrongNum()!=null) s.setWrongNum(req.getWrongNum());
        if (req.getAnswerDetailsJson()!=null) s.setAnswerDetailsJson(req.getAnswerDetailsJson());
        if (req.getAiSummary()!=null) s.setAiSummary(req.getAiSummary());
        if (req.getUserName()!=null) s.setUserName(req.getUserName());
        if (req.getUserId()!=null) s.setUserId(req.getUserId());
        if (req.getStatus()!=null) s.setStatus(req.getStatus());
        if (req.getCode()!=null && !req.getCode().isBlank()) s.setCode(req.getCode());
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try { if (req.getStartTime()!=null) s.setStartTime(fmt.parse(req.getStartTime())); } catch(ParseException ignored){}
        try { if (req.getEndTime()!=null) s.setEndTime(fmt.parse(req.getEndTime())); } catch(ParseException ignored){}
        return toDTO(repo.save(s));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamSessionDTO> search(Long userId, String userName, String subject, Integer grade, String code, String q, Integer status, int page, int size) {
        PageRequest pr = PageRequest.of(Math.max(0,page), Math.max(1,size));
        String u = emptyToNull(userName);
        String sub = emptyToNull(subject);
        String cd = emptyToNull(code);
        String qq = emptyToNull(q);
        if (userId == null && u != null && sub == null && grade == null && cd == null && qq == null) {
            Page<ExamSession> p = repo.findByUserNameContainingIgnoreCaseAndStatus(u, status, pr);
            return new PageImpl<>(p.getContent().stream().map(this::toDTO).collect(Collectors.toList()), pr, p.getTotalElements());
        }
        Page<ExamSession> p = repo.search(userId, u, sub, grade, cd, status, qq, pr);
        return new PageImpl<>(p.getContent().stream().map(this::toDTO).collect(Collectors.toList()), pr, p.getTotalElements());
    }

    private String emptyToNull(String s){ return (s==null || s.trim().isEmpty())? null : s.trim(); }
}
