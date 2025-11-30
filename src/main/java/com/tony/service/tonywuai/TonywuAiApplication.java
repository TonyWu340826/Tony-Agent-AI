package com.tony.service.tonywuai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TonywuAiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TonywuAiApplication.class, args);
    }

}
