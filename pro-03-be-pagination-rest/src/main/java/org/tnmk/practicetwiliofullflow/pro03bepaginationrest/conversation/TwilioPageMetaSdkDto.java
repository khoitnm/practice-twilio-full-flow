package org.tnmk.practicetwiliofullflow.pro03bepaginationrest.conversation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TwilioPageMetaSdkDto {
  @JsonProperty("page")
  private int page;

  @JsonProperty("page_size")
  private int pageSize;

  @JsonProperty("first_page_url")
  private String firstPageUrl;

  @JsonProperty("previous_page_url")
  private String previousPageUrl;

  @JsonProperty("url")
  private String url;

  @JsonProperty("next_page_url")
  private String nextPageUrl;

  /**
   * It could be `messages`, `conversations`, `users`, `participants`, etc.
   */
  @JsonProperty("key")
  private String key;
}
