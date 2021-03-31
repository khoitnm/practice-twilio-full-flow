import React, {FormEvent, useState} from 'react';
import {Button, Container, Grid, TextField} from '@material-ui/core';
import routingPath from "../common/pagerouting/RoutingPath";
import TwilioAccess from "../common/twilio/accesstoken/TwilioAccess";
import twilioAccessBackendClient from "../common/twilio/accesstoken/TwilioAccessBackendClient";
import twilioAccessRepository from "../common/twilio/accesstoken/TwilioAccessRepository";
import {useHistory} from 'react-router-dom';
import userRepository from "./UserRepository";

const LoginPage = (): JSX.Element => {
  const [username, setUsername] = useState('user01');
  const history = useHistory(); //for navigation

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();

    const twilioAccess: TwilioAccess = await twilioAccessBackendClient.createAccessToken(username);
    twilioAccessRepository.setTwilioAccessToken(twilioAccess.accessToken);
    userRepository.setUsername(username);
    history.push(routingPath.conversationsList);
  };

  return (
    <Container maxWidth="xs">
      <form onSubmit={submitLogin}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            Login
          </Grid>
          <Grid item xs={12}>
            <TextField value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required={true}
                       fullWidth label="Username" name="username" size="small" variant="outlined"/>
          </Grid>
          <Grid item xs={12}>
            <Button color="secondary" fullWidth type="submit" variant="contained">
              Log in
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default LoginPage;
