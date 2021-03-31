import {AppBar, Button, Container, Grid, TextField, Toolbar} from '@material-ui/core';
import React, {MouseEvent, useEffect, useState} from "react";
import twilioConversationClient from "../common/twilio/conversation/TwilioConversationClient";
import {RouteComponentProps} from "react-router-dom";
import authenticationService from "../login/AuthenticationService";
import {Conversation} from "@twilio/conversations/lib/conversation";
import {Message} from "@twilio/conversations/lib/message";
import {Participant} from "@twilio/conversations/lib/participant";

type ConversationDetailPageProps = {
    /**
     * The name here must be the same as the path variable in {@link routingPath.conversationDetail}
     */
    conversationSid: string;
};

const ConversationDetailPage = ({match}: RouteComponentProps<ConversationDetailPageProps>): JSX.Element => {
    const conversationSid = match.params.conversationSid;
    const authenticatedUser: AuthenticatedUser = authenticationService.validateAuthenticated();

    const [conversation, setConversation] = useState<Conversation>();
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [participants, setParticipants] = useState<Array<Participant>>([]);
    const [newParticipantName, setNewParticipantName] = useState('username03');

    useEffect(() => {
        loadConversation(conversationSid).then((conversation: Conversation) => {
            setConversation(conversation);
            conversation.getParticipants().then((allParticipants) => {
                setParticipants(allParticipants);
                loadAllMessages(conversation).then((allMessages: Array<Message>) => {
                    setMessages(allMessages);
                });
            })
        });
        //TODO
        //  load participants
        //  load messages
    }, [conversationSid]);

    const loadConversation = async (conversationSid: string): Promise<Conversation> => {
        return await twilioConversationClient.getConversation(conversationSid);
    };
    const loadAllMessages = async (conversation: Conversation): Promise<Array<Message>> => {
        const allMessages: Array<Message> = [];
        let paginator = await conversation.getMessages();
        allMessages.concat(paginator.items);
        while (paginator.hasNextPage) {
            paginator = await paginator.nextPage();
            allMessages.concat(paginator.items);
        }
        return allMessages;
    };
    const onAddParticipant = async (event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>) => {

    };
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    Conversation Detail
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container spacing={5} direction={'row'}>
                    <Grid item xs={12}>
                        {/*Just to create a space line here*/}
                    </Grid>
                    <Grid item xs={3}>
                        Username: {authenticatedUser.username} <br/>
                        Conversation sid: {conversation?.sid} <br/>
                        Conversation uniqueName: {conversation?.uniqueName} <br/>
                        Conversation friendlyName: {conversation?.friendlyName} <br/>
                        Conversation state: {JSON.stringify(conversation?.state)} <br/>
                        Conversation status: {conversation?.status} <br/>
                        Conversation attributes: {JSON.stringify(conversation?.attributes)} <br/>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={1} direction={'column'}>
                            {messages.map((message: Message) => (
                                <Grid key={message.sid} item xs={12}>
                                    {message.sid}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        {participants.map((participant: Participant) => (
                            <div key={participant.sid}>
                                Participant: {participant.identity}
                            </div>
                        ))}

                        <Button onClick={onAddParticipant}
                                variant="contained" color="primary" disableElevation fullWidth>
                            Add Participant
                        </Button>
                        <TextField
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                            required={true}
                            fullWidth
                            label="Target Username"
                            name="targetUsername"
                            size="small"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <Grid container spacing={0} direction={'column'}>
                            {/*{loadedFiles.map((file: IDFile) => (*/}
                            {/*    <FileBrowserItem key={file.id} file={file} />*/}
                            {/*))}*/}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
export default ConversationDetailPage;