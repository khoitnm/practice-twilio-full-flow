package org.tnmk.practicetwiliofullflow.pro00besimple.common.test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
}
