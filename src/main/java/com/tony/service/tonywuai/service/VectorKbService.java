package com.tony.service.tonywuai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tony.service.tonywuai.dto.request.ChunkEmbedRequest;
import com.tony.service.tonywuai.entity.AiKbDocument;
import com.tony.service.tonywuai.entity.AiKbSpace;
import com.tony.service.tonywuai.repository.AiKbDocumentRepository;
import com.tony.service.tonywuai.repository.AiKbSpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VectorKbService {

    private final AiKbSpaceRepository spaceRepository;
    private final AiKbDocumentRepository documentRepository;
    private final DocumentUploadFacade documentUploadFacade;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<AiKbSpace> listSpaces(String userName) {
        return spaceRepository.findByUserIdOrderByUpdatedAtDesc(userName);
    }

    public AiKbSpace getSpace(String userName, Long spaceId) {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("未登录");
        }
        if (spaceId == null) {
            throw new IllegalArgumentException("spaceId不能为空");
        }
        return spaceRepository.findByIdAndUserId(spaceId, userName)
                .orElseThrow(() -> new IllegalArgumentException("空间不存在"));
    }

    @Transactional
    public AiKbSpace createSpace(String userName, String name, String description) {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("未登录");
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("空间名称不能为空");
        }

        AiKbSpace space = new AiKbSpace();
        space.setUserId(userName);
        space.setName(name.trim());
        space.setDescription(description == null ? null : description.trim());

        String orgCode = generateOrgCode(userName);
        int tries = 0;
        while (spaceRepository.existsByUserIdAndOrgCode(userName, orgCode)) {
            if (tries++ > 10) {
                throw new IllegalStateException("生成空间编码失败，请重试");
            }
            orgCode = generateOrgCode(userName);
        }
        space.setOrgCode(orgCode);

        return spaceRepository.save(space);
    }

    public List<AiKbDocument> listDocuments(String userName, String orgCode) {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("未登录");
        }
        if (orgCode == null || orgCode.isBlank()) {
            throw new IllegalArgumentException("orgCode不能为空");
        }
        return documentRepository.findByUserIdAndOrgCodeOrderByCreatedAtDesc(userName, orgCode);
    }

    @Transactional
    public void deleteDocument(String userName, Long docId) {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("未登录");
        }
        if (docId == null) {
            throw new IllegalArgumentException("docId不能为空");
        }
        AiKbDocument doc = documentRepository.findByIdAndUserId(docId, userName)
                .orElseThrow(() -> new IllegalArgumentException("文档不存在"));
        documentRepository.delete(doc);
    }

    @Transactional
    public AiKbDocument uploadAndProcess(String userName, Long spaceId, MultipartFile file, ChunkEmbedRequest req) throws Exception {
        if (userName == null || userName.isBlank()) {
            throw new IllegalArgumentException("未登录");
        }
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        AiKbSpace space = spaceRepository.findByIdAndUserId(spaceId, userName)
                .orElseThrow(() -> new IllegalArgumentException("空间不存在"));

        String baseType = (req != null && req.getDocType() != null) ? req.getDocType() : null;
        if (baseType == null || baseType.isBlank()) {
            baseType = guessDocType(file.getOriginalFilename());
        }
        if (baseType == null) {
            throw new IllegalArgumentException("无法识别文档类型");
        }

        // docType 作为文档唯一标识：DOC_随机5字符_文档类型
        String docType = "DOC_" + randomAlnum(5) + "_" + baseType;

        if (req == null) {
            req = new ChunkEmbedRequest();
        }
        req.setDocType(docType);
        req.setOrgCode(space.getOrgCode());

        AiKbDocument doc = new AiKbDocument();
        doc.setSpace(space);
        doc.setUserId(userName);
        doc.setOrgCode(space.getOrgCode());
        doc.setFileName(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        doc.setDocType(docType);
        doc.setFileSize(file.getSize());
        doc.setMimeType(file.getContentType());
        doc.setStoragePath(null);
        doc.setChecksum(null);
        doc.setStatus("PARSING");

        Map<String, Object> process = new LinkedHashMap<>();
        process.put("upload", stepOk());
        process.put("read", stepPending());
        process.put("split", stepPending());
        process.put("group", stepPending());
        process.put("embed", stepPending());
        process.put("save", stepPending());

        doc.setProcessJson(objectMapper.writeValueAsString(process));
        doc = documentRepository.save(doc);

        try {
            // 复用已调通的上传逻辑：内部完成读取/切分/分组/嵌入/保存
            documentUploadFacade.upload(file, null, req);

            // 只要接口不报错，即视为全流程成功
            process.put("read", stepOk());
            process.put("split", stepOk());
            process.put("group", stepOk());
            process.put("embed", stepOk());
            process.put("save", stepOk());
            doc.setProcessJson(objectMapper.writeValueAsString(process));
            doc.setStatus("READY");
            doc.setErrorMessage(null);
            return documentRepository.save(doc);
        } catch (Exception e) {
            Map<String, Object> failed = new LinkedHashMap<>();
            failed.put("ok", false);
            failed.put("ts", OffsetDateTime.now().toString());
            failed.put("error", e.getMessage());

            // 保持前端展示一致：失败优先标记在 embed/save
            process.put("embed", failed);
            process.put("save", failed);

            doc.setProcessJson(objectMapper.writeValueAsString(process));
            doc.setStatus("FAILED");
            doc.setErrorMessage(e.getMessage());
            documentRepository.save(doc);
            throw e;
        }
    }

    public AiKbDocument getDocument(String userName, Long docId) {
        return documentRepository.findByIdAndUserId(docId, userName)
                .orElseThrow(() -> new IllegalArgumentException("文档不存在"));
    }

    private static Map<String, Object> stepOk() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ok", true);
        m.put("ts", OffsetDateTime.now().toString());
        return m;
    }

    private static Map<String, Object> stepPending() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ok", null);
        m.put("ts", OffsetDateTime.now().toString());
        return m;
    }

    private static boolean isPending(Object v) {
        if (!(v instanceof Map<?, ?> map)) return false;
        return map.get("ok") == null;
    }

    private static final SecureRandom RND = new SecureRandom();
    private static final char[] ALNUM = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();

    private static String generateOrgCode(String userName) {
        return "Vector_" + userName + "_" + randomAlnum(6);
    }

    private static String randomAlnum(int len) {
        char[] out = new char[len];
        for (int i = 0; i < len; i++) {
            out[i] = ALNUM[RND.nextInt(ALNUM.length)];
        }
        return new String(out);
    }

    private static String guessDocType(String fileName) {
        if (fileName == null) return null;
        String n = fileName.toLowerCase();
        if (n.endsWith(".pdf")) return "pdf";
        if (n.endsWith(".docx")) return "docx";
        if (n.endsWith(".txt")) return "txt";
        if (n.endsWith(".md")) return "md";
        return null;
    }
}
