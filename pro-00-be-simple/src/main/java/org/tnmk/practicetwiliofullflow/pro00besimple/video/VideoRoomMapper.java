package org.tnmk.practicetwiliofullflow.pro00besimple.video;

import com.twilio.rest.video.v1.Room;

import java.util.ArrayList;
import java.util.List;

public class VideoRoomMapper {
  public static VideoRoom toVideoRoom(Room room) {
    VideoRoom videoResponse = new VideoRoom();
    videoResponse.setRoomSid(room.getSid());
    videoResponse.setUniqueName(room.getUniqueName());
    videoResponse.setRoomType(room.getType().toString());
    videoResponse.setStatus(room.getStatus().toString());
    return videoResponse;
  }

  public static List<VideoRoom> toVideoRooms(Iterable<Room> rooms) {
    List<VideoRoom> result = new ArrayList<>();
    for (Room room : rooms) {
      result.add(toVideoRoom(room));
    }
    return result;
  }
}
