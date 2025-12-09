package com.tony.service.tonywuai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.security.SecureRandom;
import javax.imageio.ImageIO;

@RestController
@RequestMapping("/api/captcha")
@Tag(name = "验证码", description = "图形验证码生成接口")
public class CaptchaController {

    private static final String SESSION_KEY = "CAPTCHA_CODE";
    private static final SecureRandom RANDOM = new SecureRandom();

    @GetMapping(value = "/image", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "获取图形验证码", description = "生成PNG格式的图形验证码，并将验证码存储在Session中")
    public void getCaptcha(HttpSession session, HttpServletResponse response) throws IOException {
        String code = generateCode(5);
        session.setAttribute(SESSION_KEY, code);

        BufferedImage image = renderImage(code);
        response.setContentType(MediaType.IMAGE_PNG_VALUE);
        ImageIO.write(image, "png", response.getOutputStream());
    }

    public static String getSessionKey() { return SESSION_KEY; }

    private String generateCode(int len) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        return sb.toString();
    }

    private BufferedImage renderImage(String code) {
        int w = 120, h = 40;
        BufferedImage img = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = img.createGraphics();
        g.setColor(new Color(245, 247, 250));
        g.fillRect(0, 0, w, h);
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.setColor(new Color(37, 99, 235));
        g.drawString(code, 15, 28);
        g.setColor(new Color(203, 213, 225));
        for (int i = 0; i < 8; i++) {
            int x1 = RANDOM.nextInt(w), y1 = RANDOM.nextInt(h), x2 = RANDOM.nextInt(w), y2 = RANDOM.nextInt(h);
            g.drawLine(x1, y1, x2, y2);
        }
        g.dispose();
        return img;
    }
}

