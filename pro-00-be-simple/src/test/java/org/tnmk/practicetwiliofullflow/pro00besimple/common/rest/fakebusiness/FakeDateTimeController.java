package org.tnmk.practicetwiliofullflow.pro00besimple.common.rest.fakebusiness;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.invoke.MethodHandles;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

@RestController
public class FakeDateTimeController {
  private final static Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  @PostMapping(path = "/common.rest.fakebusiness/datetime")
  public FakeResponse returnResponseWithDateTime(@RequestBody FakeRequest fakeRequest) {
    ZonedDateTime zonedDateTime = createZoneDateTime(fakeRequest);
    ZonedDateTime utcDateTimeZoneIdUTC = zonedDateTime.withZoneSameInstant(ZoneId.of("UTC"));
    ZonedDateTime utcDateTimeZoneOffsetUTC = zonedDateTime.withZoneSameInstant(ZoneOffset.UTC);
    logger.info("utcDateTimeZoneIdUTC: " + utcDateTimeZoneIdUTC);
    logger.info("utcDateTimeZoneOffsetUTC: " + utcDateTimeZoneOffsetUTC);

    FakeResponse result = new FakeResponse(zonedDateTime, zonedDateTime.toOffsetDateTime(), utcDateTimeZoneOffsetUTC);
    logger.info("Result: " + result);
    return result;
  }

  private ZonedDateTime createZoneDateTime(FakeRequest fakeRequest) {
    ZonedDateTime zonedDateTime = ZonedDateTime.of(
        fakeRequest.getYear(), fakeRequest.getMonth(), fakeRequest.getDay(),
        fakeRequest.getHour(), fakeRequest.getMin(), fakeRequest.getSec(), fakeRequest.getNano(),
        ZoneId.of(fakeRequest.getZoneId()));
    return zonedDateTime;
  }

}