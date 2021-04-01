import React, {MouseEvent, useState} from "react";
import {Button, Grid} from "@material-ui/core";
import twilioVideoClient from "../common/twilio/video/TwilioVideoClient";
import {Room} from "twilio-video";
import VideoRoomState from "./VideoRoomState";

export interface VideoRoomItemProps {
  videoRoom: Room;
}

const styles = {
  joiningVideoRoomContainer: {
    borderTop: '1px solid #BBB',
    borderBottom: '1px solid #BBB',
    boxShadow: '0 3px -2px 2px rgba(255, 255, 255, .3)',
  }
};

const VideoRoomJoining = (props: VideoRoomItemProps): JSX.Element => {
  const [room, setRoom] = useState<Room>(props.videoRoom);


  const onDisconnectVideoRoom = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
    try {
      const disconnectedRoom = room.disconnect();
      setRoom(disconnectedRoom);
    } catch (error) {
      console.error(`Cannot disconnect video room: ${room.name}. Error message: ${error.toString()}`, error);
    }
  }

  return (
    <Grid item xs={12} style={styles.joiningVideoRoomContainer}>
      SID: {room.sid} <br/>
      Unique Name: {room.name} <br/>
      State: {room.state} <br/>
      Local Participant: {JSON.stringify(room.localParticipant)}<br/>
      Participants: {JSON.stringify(room.participants)}<br/>

      <Button color="secondary" fullWidth type="submit" variant="contained" onClick={onDisconnectVideoRoom}>
        Leave Room
      </Button>
    </Grid>
  );
};

export default VideoRoomJoining;
