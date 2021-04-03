https://stackoverflow.com/questions/58159215/twilio-video-api-notification-ring
> Comment from a Twilio developer evangelist: __There is nothing within the Twilio Video SDK that provides for notification of users__. That is up to your application to implement in whichever way works for you.
> In that link, a person mentioned FCM (https://firebase.google.com/docs/cloud-messaging), but it used for SMS???
> It does not support Safari notification: Twilio does nothing to support push notifications in Safari. It only supports web push notifications via FCM right now (2019)

So the conclusion is:
- No support Video notification when a user has not joined any Video Room.
- When a user already joined a Video Room, he can listen to a few events: https://www.twilio.com/docs/video/api/status-callbacks
    - Some example code in: [VideoRoomCall.tsx](../pro-00-fe-simple/src/video/VideoRoomCall.tsx)
        - participantConnected
        - participantDisconnected
    - Or some other events in [ParticipantVideo.tsx](../pro-00-fe-simple/src/video/ParticipantVideo.tsx)
        - trackSubscribed
        - trackUnsubscribed
    - We can trigger "room-ended" event programmatically here: https://www.twilio.com/docs/video/api/rooms-resource?code-sample=code-complete-a-room&code-language=Java&code-sdk-version=8.x

Therefore, we may need to research about other notification solutions:
- https://www.twilio.com/docs/notify/send-notifications