export default interface CallMessageBody {
  //We don't need to store any other information about conversation any more because they are already parts of message's metadata.
  room: {
    sid: string,
    uniqueName: string,
    /**
     * This is not really the local participant of the room.
     * This is the first person who started the room (basically the person who start the call request).
     * Note: that person actually can join the room after other remote participants, though.
     *
     * However, when that person start the room, he doesn't really join the room yet. So he won't have startedParticipantSid
     */
    startedParticipantIdentity?: string,
    // startedParticipantSid?: string
  }
}