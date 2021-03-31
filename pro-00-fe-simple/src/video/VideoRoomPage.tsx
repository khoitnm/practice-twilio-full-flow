import React, {MouseEvent, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Container, Grid, TextField} from "@material-ui/core";
import VideoRoomBE from "../common/twilio/video/VideoRoomBE";
import backendVideoClient from "../common/twilio/video/BackendVideoClient";
import twilioVideoClient from "../common/twilio/video/TwilioVideoClient";
import {Room} from "twilio-video";
import VideoRoomState from "./VideoRoomState";
import VideoRoomItem from "./VideoRoomItem";

const VideoRoomPage = (): JSX.Element => {
  const [videoRooms, setVideoRooms] = useState<Array<VideoRoomState>>([]);
  const [targetParticipantUsername, setTargetParticipantUsername] = useState<string>('user02');
  const history = useHistory(); //for navigation

  useEffect(() => {
    loadVideoRooms().finally(() => {
      console.log(`Loaded video rooms`);
    });
  }, []);

  const loadVideoRooms = async () => {
    const rooms: VideoRoomBE[] = await backendVideoClient.findAllRooms();
    const videoRoomStates: VideoRoomState[] = rooms as VideoRoomState[];
    setVideoRooms(videoRoomStates);
  };

  const onStartNewVideoRoom = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
    const room: Room = await twilioVideoClient.startNewVideoRoomOneOnOne(targetParticipantUsername);
    const videoRoomState: VideoRoomState = {roomSid: room.sid, uniqueName: room.name};
    const updatedVideoRooms: VideoRoomState[] = [...videoRooms, videoRoomState];
    setVideoRooms(updatedVideoRooms);
  }

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField value={targetParticipantUsername}
                     onChange={(e) => setTargetParticipantUsername(e.target.value)}
                     required={true}
                     fullWidth label="Username" name="username" size="small" variant="outlined"/>
        </Grid>
        <Grid item xs={6}>
          <Button color="secondary" fullWidth type="submit" variant="contained" onClick={onStartNewVideoRoom}>
            Start New Video Call
          </Button>
        </Grid>
        <Grid item xs={12}>

          {/*List of VideoRooms: Begin*/}
          <Grid container spacing={3}>
            {videoRooms.map((videoRoom) => (
              <VideoRoomItem key={videoRoom.roomSid} videoRoom={videoRoom}></VideoRoomItem>
            ))}
          </Grid>
          {/*List of VideoRooms: End*/}


        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoRoomPage;
