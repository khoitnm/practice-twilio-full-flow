const routingPath = {
    login: `/login`,
    conversationsList: `/conversations`,
    conversationDetailPrefix: `/conversation/`, //+ :conversationSid

    // The path variable name 'conversationSid' must be the same as {@link ConversationDetailPageProps.conversationSid}
    conversationDetail: `/conversation/:conversationSid`,
};
export default routingPath;
