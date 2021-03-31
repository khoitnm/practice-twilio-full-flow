import React, {MouseEvent} from "react";
import {Button, Grid} from "@material-ui/core";
import twilioVideoClient from "../common/twilio/video/TwilioVideoClient";
import {Room} from "twilio-video";
import VideoRoomState from "./VideoRoomState";

export interface VideoRoomItemProps {
  videoRoom: VideoRoomState;
  fnJoinRoomCallback: (room: Room) => unknown;
}

const VideoRoomItem = (props: VideoRoomItemProps): JSX.Element => {
  const videoRoom = props.videoRoom;

  const onJoinVideoRoom = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
    try {
      const room: Room = await twilioVideoClient.joinVideoRoom(videoRoom.uniqueName);
      props.fnJoinRoomCallback(room);
    } catch (error) {
      console.error(`Cannot join video room: ${videoRoom.uniqueName}. Error message: ${error.toString()}`, error);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        SID: {videoRoom.roomSid} <br/>
        Unique Name: {videoRoom.uniqueName} <br/>
        State: {videoRoom.state} <br/>
      </Grid>
      <Grid item xs={6}>
        <Button color="secondary" fullWidth type="submit" variant="contained" onClick={onJoinVideoRoom}>
          Join Room
        </Button>
      </Grid>
    </Grid>

  );
};

export default VideoRoomItem;
