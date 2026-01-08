package com.tony.service.tonywuai.controller;

import com.tony.service.tonywuai.dto.request.ChunkEmbedRequest;
import com.tony.service.tonywuai.entity.AiKbDocument;
import com.tony.service.tonywuai.entity.AiKbSpace;
import com.tony.service.tonywuai.service.VectorKbService;
import lombok.RequiredArgsConstructor;
import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vector")
@RequiredArgsConstructor
public class VectorKbController {

    private final VectorKbService vectorKbService;

    @GetMapping("/spaces")
    public ResponseEntity<?> listSpaces(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }
        List<AiKbSpace> list = vectorKbService.listSpaces(principal.getUsername());
        return ResponseEntity.ok(Map.of("success", true, "data", list));
    }

    @PostMapping(value = "/spaces", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createSpace(@AuthenticationPrincipal UserDetails principal, @RequestBody Map<String, Object> body) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }
        String name = body.get("name") == null ? null : String.valueOf(body.get("name"));
        String desc = body.get("description") == null ? null : String.valueOf(body.get("description"));
        AiKbSpace space = vectorKbService.createSpace(principal.getUsername(), name, desc);
        return ResponseEntity.ok(Map.of("success", true, "data", space));
    }

    @GetMapping("/spaces/{spaceId}/documents")
    public ResponseEntity<?> listDocuments(@AuthenticationPrincipal UserDetails principal, @PathVariable Long spaceId) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }
        try {
            AiKbSpace space = vectorKbService.getSpace(principal.getUsername(), spaceId);
            List<AiKbDocument> docs = vectorKbService.listDocuments(principal.getUsername(), space.getOrgCode());
            return ResponseEntity.ok(Map.of("success", true, "data", docs));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping(value = "/spaces/{spaceId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long spaceId,
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "request", required = false) String requestJson,
            @ModelAttribute ChunkEmbedRequest request) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }

        try {
            if (requestJson != null && !requestJson.isBlank()) {
                request = JSONObject.parseObject(requestJson, ChunkEmbedRequest.class);
            }
            AiKbDocument doc = vectorKbService.uploadAndProcess(principal.getUsername(), spaceId, file, request);
            return ResponseEntity.ok(Map.of("success", true, "data", doc));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/documents/{docId}")
    public ResponseEntity<?> getDocument(@AuthenticationPrincipal UserDetails principal, @PathVariable Long docId) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }
        try {
            AiKbDocument doc = vectorKbService.getDocument(principal.getUsername(), docId);
            return ResponseEntity.ok(Map.of("success", true, "data", doc));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/documents/{docId}")
    public ResponseEntity<?> deleteDocument(@AuthenticationPrincipal UserDetails principal, @PathVariable Long docId) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "未登录"));
        }
        try {
            vectorKbService.deleteDocument(principal.getUsername(), docId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
