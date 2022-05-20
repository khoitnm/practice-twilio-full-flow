package org.tnmk.practicetwiliofullflow.pro00besimpleconversation.common.rest.fakebusiness;

public class FakeRequest {
  private int year;
  private int month;
  private int day;
  private int hour;
  private int min;
  private int sec;
  private int nano;
  private String zoneId;

  public FakeRequest() {
  }

  public FakeRequest(int year, int month, int day, int hour, int min, int sec, int nano, String zoneId) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.min = min;
    this.sec = sec;
    this.nano = nano;
    this.zoneId = zoneId;
  }

  public int getYear() {
    return year;
  }

  public void setYear(int year) {
    this.year = year;
  }

  public int getMonth() {
    return month;
  }

  public void setMonth(int month) {
    this.month = month;
  }

  public int getDay() {
    return day;
  }

  public void setDay(int day) {
    this.day = day;
  }

  public int getHour() {
    return hour;
  }

  public void setHour(int hour) {
    this.hour = hour;
  }

  public int getMin() {
    return min;
  }

  public void setMin(int min) {
    this.min = min;
  }

  public int getSec() {
    return sec;
  }

  public void setSec(int sec) {
    this.sec = sec;
  }

  public int getNano() {
    return nano;
  }

  public void setNano(int nano) {
    this.nano = nano;
  }

  public String getZoneId() {
    return zoneId;
  }

  public void setZoneId(String zoneId) {
    this.zoneId = zoneId;
  }
}
