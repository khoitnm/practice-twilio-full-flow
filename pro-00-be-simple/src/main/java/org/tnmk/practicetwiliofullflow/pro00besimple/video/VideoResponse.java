package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.rest.video.v1.Room;

public class VideoResponse {
  private Room room;

  public Room getRoom() {
    return room;
  }

  public void setRoom(Room room) {
    this.room = room;
  }
}
