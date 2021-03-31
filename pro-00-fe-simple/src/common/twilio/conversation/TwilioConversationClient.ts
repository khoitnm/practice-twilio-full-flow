import {Conversation} from "@twilio/conversations/lib/conversation";
import {Paginator} from "@twilio/conversations/lib/interfaces/paginator";
import {Message} from "@twilio/conversations/lib/message";
import twilioClientFactory from "../TwilioClientFactory";
import {User} from "@twilio/conversations";

/**
 * Guideline:
 * https://www.twilio.com/docs/conversations/sdk-download-install
 * https://www.npmjs.com/package/@twilio/conversations
 */
const twilioConversationClient = {
    getSubscribedUsers: async (): Promise<Array<User>> => {
        const client = await twilioClientFactory.getConversationClient();
        return await client.getSubscribedUsers();
    },
    /**
     * the participantIdentifier must have an existing User in Twilio.
     * If there's no corresponding user, it will throw an error.
     * @param mainUserIdentifier
     * @param targetParticipantIdentifier
     */
    createConversation: async (targetParticipantIdentifier: string): Promise<Conversation> => {
        const client = await twilioClientFactory.getConversationClient();
        const conversation: Conversation = await client.createConversation();

        //We should not use conversation.add(mainUserIdentifier) because adding to a conversation alone is not enough. It won't be able to see messages in a conversation?
        //We have to subscribe to a conversation to see messages.
        //And to subscribe to a conversation, we should use conversation.join()
        await conversation.join();
        await conversation.add(targetParticipantIdentifier);
        return conversation;
    },

    loadConversationsList: async (): Promise<Paginator<Conversation>> => {
        const client = await twilioClientFactory.getConversationClient();
        const paginator = await client.getSubscribedConversations()
        return paginator;
    },
    getConversation: async (conversationSid: string): Promise<Conversation> => {
        const client = await twilioClientFactory.getConversationClient();
        const conversation = client.getConversationBySid(conversationSid);
        return conversation;
    },
    getMessages: async (conversation: Conversation): Promise<Paginator<Message>> => {
        return await conversation.getMessages();
    }
}
export default twilioConversationClient;