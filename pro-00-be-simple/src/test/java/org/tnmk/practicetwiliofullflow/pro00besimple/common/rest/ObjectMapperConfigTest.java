package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.tnmk.practicetwiliofullflow.pro00besimple.testinfra.BaseIntegrationTest;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class ObjectMapperConfigTest extends BaseIntegrationTest {

  @Autowired
  private ObjectMapper objectMapper;

  @ParameterizedTest
  @CsvSource({
      "UTC,               2021-12-31T23:23:23.999999999Z",
      "America/New_York,  2021-12-31T23:23:23.999999999-05:00",//UTC-05:00 https://www.zeitverschiebung.net/en/timezone/america--new_york
  })
  public void convert_ZonedDateTime_to_JsonString(String zoneId, String expectedDateTimeString) throws JsonProcessingException, JSONException {
    //given
    int year = 2021;
    int month = 12;
    int day = 31;
    int hour = 23;
    int min = 23;
    int sec = 23;
    int nano = 999999999;
    ZonedDateTime zonedDateTime = ZonedDateTime.of(year, month, day, hour, min, sec, nano, ZoneId.of(zoneId).normalized());
    SampleObjectWithDateTime original = new SampleObjectWithDateTime(zonedDateTime, zonedDateTime.toOffsetDateTime());

    //when
    String actualJson = objectMapper.writeValueAsString(original);

    //then
    JSONObject actualJsonObject = new JSONObject(actualJson);
    Assertions.assertEquals(expectedDateTimeString.trim(), actualJsonObject.getString("zonedDateTime"));
  }

  @Test
  public void convert_JsonString_to_ZonedDateTime() throws JsonProcessingException, JSONException {
    //given
    String dateTimeInJson = "2021-12-31T23:23:23.999999999Z";
    String json = String.format("{\"zonedDateTime\":\"%s\", \"offsetDateTime\":\"%s\"}", dateTimeInJson, dateTimeInJson);

    //when
    SampleObjectWithDateTime object = objectMapper.readValue(json, SampleObjectWithDateTime.class);

    //then
    ZonedDateTime expectedZonedDateTime = ZonedDateTime.of(2021, 12, 31,
        23, 23, 23, 999999999,
        ZoneOffset.UTC);
    //Note:
    // - ZoneId.of("UTC") (Zone = "UTC")  is different from   ZoneOffset.UTC (Zone = "Z")
    // - ZoneId.of("UTC").normalized()    is equals to        ZoneOffset.UTC (Zone = "Z")
    Assertions.assertEquals(expectedZonedDateTime, object.getZonedDateTime());
  }

  static class SampleObjectWithDateTime {
    ZonedDateTime zonedDateTime;
    OffsetDateTime offsetDateTime;

    public SampleObjectWithDateTime() {
    }

    public SampleObjectWithDateTime(ZonedDateTime zonedDateTime, OffsetDateTime offsetDateTime) {
      this.zonedDateTime = zonedDateTime;
      this.offsetDateTime = offsetDateTime;
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
}
