import {AppBar, Container, Grid, Toolbar} from '@material-ui/core';
import React, {useEffect, useState} from "react";
import authenticationService from "../login/AuthenticationService";
import twilioConversationClient from "../common/twilio/conversation/TwilioConversationClient";
import {Conversation} from "@twilio/conversations/lib/conversation";
import ConversationCreationComponent from "./ConversationCreationComponent";

const ConversationsListPage = (): JSX.Element => {
    const authenticatedUser: AuthenticatedUser = authenticationService.validateAuthenticated();
    const [conversations, setConversations] = useState([] as Conversation[]);

    useEffect(() => {
        loadAllConversations()
            .then((result) => {
                setConversations(result);
            });
    }, []);

    const loadAllConversations = async (): Promise<Array<Conversation>> => {
        const conversations: Array<Conversation> = [];
        let paginator = await twilioConversationClient.loadConversationsList();
        conversations.concat(paginator.items);
        while (paginator.hasNextPage) {
            paginator = await paginator.nextPage();
            conversations.concat(paginator.items);
        }
        return conversations;
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    Conversations List
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={5} direction={'row'}>
                    <Grid item xs={4}>
                        {authenticatedUser.username}
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={1} direction={'column'}>
                            Conversations List:
                            {conversations.map((conversation: Conversation) => (
                                <Grid key={conversation.sid} item xs={12}>
                                    SID: {conversation.sid} <br/>
                                    Friendly Name: {conversation.friendlyName} <br/>
                                    Unique Name: {conversation.uniqueName} <br/>
                                    Created by: {conversation.createdBy} <br/>
                                    JSON: {JSON.stringify(conversation)} <br/>
                                </Grid>

                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <ConversationCreationComponent twilioAccessToken={authenticatedUser.twilioAccessToken}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
export default ConversationsListPage;