https://www.twilio.com/docs/notify/send-notifications

https://stackoverflow.com/questions/58159215/twilio-video-api-notification-ring
- Twilio developer evangelist here.
- There is nothing within the Twilio Video SDK that provides for notification of users. That is up to your application to implement in whichever way works for you.
- In that link, a person mentioned FCM (https://firebase.google.com/docs/cloud-messaging), but it used for SMS???
- It does not support Safari notification: Twilio does nothing to support push notifications in Safari. It only supports web push notifications via FCM right now