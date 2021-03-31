package org.tnmk.practicetwiliofullflow.pro00besimple.testinfra;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;

public class JsonHelper {
  private static final ObjectMapper objectMapper = new ObjectMapper();


  public static String toJson(Object object) {
    try {
      return objectMapper.writeValueAsString(object);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException(e);
    }
  }

  public static <T> T toObject(String jsonString, Class<T> resultClass) {
    try {
      return objectMapper.readValue(jsonString, resultClass);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Cannot parse json. Rootcause:" + e.getMessage() + ". Json: \n" + jsonString, e);
    }
  }

  public static <T> T toObject(String jsonString, JavaType resultType) {
    try {
      return objectMapper.readValue(jsonString, resultType);
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Cannot parse json. Rootcause:" + e.getMessage() + ". Json: \n" + jsonString, e);
    }
  }
}
