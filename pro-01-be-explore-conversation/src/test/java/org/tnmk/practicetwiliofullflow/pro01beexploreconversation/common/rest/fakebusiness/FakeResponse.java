package org.tnmk.practicetwiliofullflow.pro01beexploreconversation.common.rest.fakebusiness;

import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

public class FakeResponse {
  private ZonedDateTime zonedDateTime;
  private OffsetDateTime offsetDateTime;
  private ZonedDateTime utcDateTime;

  public FakeResponse(ZonedDateTime zonedDateTime, OffsetDateTime offsetDateTime, ZonedDateTime utcDateTime) {
    this.zonedDateTime = zonedDateTime;
    this.offsetDateTime = offsetDateTime;
    this.utcDateTime = utcDateTime;
  }

  @Override public String toString() {
    return "FakeResponse{" +
        "zonedDateTime=" + zonedDateTime +
        ", offsetDateTime=" + offsetDateTime +
        ", utcDateTime=" + utcDateTime +
        '}';
  }

  public ZonedDateTime getUtcDateTime() {
    return utcDateTime;
  }

  public void setUtcDateTime(ZonedDateTime utcDateTime) {
    this.utcDateTime = utcDateTime;
  }

  public ZonedDateTime getZonedDateTime() {
    return zonedDateTime;
  }

  public void setZonedDateTime(ZonedDateTime zonedDateTime) {
    this.zonedDateTime = zonedDateTime;
  }

  public OffsetDateTime getOffsetDateTime() {
    return offsetDateTime;
  }

  public void setOffsetDateTime(OffsetDateTime offsetDateTime) {
    this.offsetDateTime = offsetDateTime;
  }
}
