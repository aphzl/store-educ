package org.educ.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;

@SpringBootApplication
public class BackendRunner extends WebMvcAutoConfiguration {
    public static void main(String[] args) {
        SpringApplication.run(BackendRunner.class, args);
    }
}
