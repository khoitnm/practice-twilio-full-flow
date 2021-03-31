package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.rest.video.v1.Room;

public class VideoRoom {
  private String roomSid;
  private String uniqueName;
  private String roomType;
  private String status;

  public String getRoomSid() {
    return roomSid;
  }

  public void setRoomSid(String roomSid) {
    this.roomSid = roomSid;
  }

  public String getUniqueName() {
    return uniqueName;
  }

  public void setUniqueName(String uniqueName) {
    this.uniqueName = uniqueName;
  }

  public void setRoomType(String roomType) {
    this.roomType = roomType;
  }

  public String getRoomType() {
    return roomType;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getStatus() {
    return status;
  }
}
