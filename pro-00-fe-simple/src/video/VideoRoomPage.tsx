import React, {MouseEvent, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Button, Container, Grid} from "@material-ui/core";
import authenticationService from "../login/AuthenticationService";

const VideoRoomPage = (): JSX.Element => {
  const authenticatedUser: AuthenticatedUser = authenticationService.validateAuthenticated();

  const [videoCalls, setVideoCalls] = useState<Array<any>>([]);
  const history = useHistory(); //for navigation

  useEffect(() => {
    listenComingVideo();
  }, []);

  const listenComingVideo = () => {

  };

  const onCallVideo = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
    // authenticatedUser.twilioAccessToken;
  }

  return (
    <Container maxWidth="xs">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button color="secondary" fullWidth type="submit" variant="contained" onClick={onCallVideo}>
            Start Video call
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoRoomPage;
