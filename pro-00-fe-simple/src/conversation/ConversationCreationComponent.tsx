import {Button, Grid, TextField} from '@material-ui/core';
import React, {MouseEvent, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import routingPath from "../common/pagerouting/RoutingPath";
import twilioConversationClient from "../common/twilio/conversation/TwilioConversationClient";
import authenticationService from "../login/AuthenticationService";
import {User} from "@twilio/conversations";

type ConversationCreationComponentProps = {
    twilioAccessToken: string;
};

const ConversationCreationComponent = (props: ConversationCreationComponentProps): JSX.Element => {
    const history = useHistory();

    const [subscribedUsers, setSubscribedUsers] = useState<Array<User>>([])
    const [targetParticipant, setTargetParticipant] = useState<string>('user02');

    useEffect(() => {
        twilioConversationClient.getSubscribedUsers().then(users => {
            setSubscribedUsers(users);
        })
    }, []);


    const onOpenConversation = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {
        const conversation = await twilioConversationClient.createConversation(targetParticipant);
        history.push(routingPath.conversationDetailPrefix + conversation.sid);
    };
    return (

        <Grid container spacing={5} direction={'column'}>
            <Grid item xs={12}>
                <Button onClick={onOpenConversation}
                        variant="contained" color="primary" disableElevation fullWidth>
                    Open Conversation
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TextField value={targetParticipant}
                           onChange={(e) => setTargetParticipant(e.target.value)}
                           required={true}
                           fullWidth label="Target Username" name="targetUsername" size="small" variant="outlined"/>
            </Grid>
            <Grid item xs={12}>
                Subscribed Users: <br/>
                {subscribedUsers.map((user: User) => (
                    <div key={user.identity}>
                        username: {user.identity}
                    </div>

                ))}
            </Grid>
        </Grid>

    );
}
export default ConversationCreationComponent;