package org.tnmk.practicetwiliofullflow.pro04betwiliomockserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.lang.invoke.MethodHandles;

@EnableAsync
@SpringBootApplication
public class Pro04BeTwilioMockServerApplication {
  public static void main(String[] args) {
    SpringApplication.run(Pro04BeTwilioMockServerApplication.class, args);
  }
}
