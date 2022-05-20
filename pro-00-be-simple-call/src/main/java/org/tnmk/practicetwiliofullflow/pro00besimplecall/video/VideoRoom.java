package org.tnmk.practicetwiliofullflow.pro00besimplecall.video;

public class VideoRoom {
  private String sid;
  private String uniqueName;
  private String roomType;
  private String status;

  public String getSid() {
    return sid;
  }

  public void setSid(String sid) {
    this.sid = sid;
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
