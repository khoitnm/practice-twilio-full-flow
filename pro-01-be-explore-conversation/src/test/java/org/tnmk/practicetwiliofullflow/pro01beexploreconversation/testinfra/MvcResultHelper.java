package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.testinfra;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;
import java.util.List;

public class MvcResultHelper {

  private static final ObjectMapper DEFAULT_OBJECT_MAPPER = new ObjectMapper();

  public static <T> T convertJsonResult(MvcResult mvcResult, Class<T> clazz) throws UnsupportedEncodingException {
    String resultJson = mvcResult.getResponse().getContentAsString();
    T result = JsonHelper.toObject(resultJson, clazz);
    return result;
  }

  public static <T> List<T> toList(MvcResult mvcResult, Class<T> elementClass) throws UnsupportedEncodingException {
    JavaType type = DEFAULT_OBJECT_MAPPER.getTypeFactory().constructCollectionType(List.class, elementClass);
    String resultJson = mvcResult.getResponse().getContentAsString();
    List<T> result = JsonHelper.toObject(resultJson, type);
    return result;
  }
}
