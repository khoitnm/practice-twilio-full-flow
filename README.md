# practice-twilio-full-flow

## Twilio Video:
### General guidelines
- Foundation knowledge: https://www.twilio.com/docs/video/tutorials/basic-concepts 
  That document describes the full flow for Video call which is very easy to understand.
- Understand Room and Room Types: https://www.twilio.com/docs/video/tutorials/understanding-video-rooms
- A good diagram to explain different concepts in Video call: 
  https://www.twilio.com/docs/video/tutorials/understanding-video-recordings-and-compositions#rooms-recordings-and-files-object-model
- API doc for JavaScript client app:
  - Overview: https://www.twilio.com/docs/video/javascript
  - Detail: https://media.twiliocdn.com/sdk/js/video/latest/docs/
- API Doc is very limited. A better way is looking at the example code in this project which is mentioned by Twilio:
  https://github.com/twilio/twilio-video-app-react
### Some other important information we need to understand:
__Room time out__ <br/>
https://www.twilio.com/docs/video/api/rooms-resource
> Note: Rooms created via the REST API exist for five minutes to allow the first Participant to connect.
> If no Participants join within five minutes, the Room times out and a new Room must be created.

<p/>
__Testing many users connect to the same Video Room on local__ <br/>
If we want to connect many participants to the same Video Room on the same local machine, 
that local machine must be connected to multiple cameras devices. 
Otherwise, only the first participant can connect to it. 
The second participant won't be able to connect because of error `twilio AbortError: Starting video failed`

