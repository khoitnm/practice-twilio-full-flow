package org.tnmk.practicetwiliofullflow.pro00besimple.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class JsonUtils {
  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static String toJsonString(Object object) {
    try {
      String json = objectMapper.writeValueAsString(object);
      return json;
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Cannot convert object to JSON string " + object + ". Root cause: " + e.getMessage(), e);
    }
  }

  public static Map<String, String> toMap(String jsonString) {
    try {
      Map<String, String> map = objectMapper.readValue(jsonString, Map.class);
      return map;
    } catch (JsonProcessingException e) {
      throw new IllegalStateException("Cannot convert JSON string to Map. Root cause: " + e.getMessage(), e);
    }
  }
}
