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
  https://github.com/twilio/twilio-video-app-react (quickly run the test by just using `npm start server`)
  https://www.twilio.com/blog/video-chat-react-hooks (there's a guideline how to build a Video component)
- Switching camera: https://www.twilio.com/blog/2018/06/switching-cameras-twilio-video-chat.html

### Some other important information we need to understand:
__Basic Terminologies__
- Media: a general term refers to either Video, or Audio, or Picture, etc. (in our case, we are focusing on Video and Audio only)
- Video: just show graphic animation, it doesn't have any sound data. Hence, we'll need the Audio (sound) data, and then we can mute/unmute it.
  The video and sound data is represented as Track, which will be mentioned in the next terminology.
- Track: 
  - General meaning in HTML: It lets you specify timed text tracks (or time-based data) data which is usually used for subtitles, for example. The tracks are formatted in WebVTT format (.vtt files) — Web Video Text Tracks.
  - Specific meaning in Twilio: a track is a data stream. So a Video Track means a Video Data Stream.

__Room time out__ <br/>
https://www.twilio.com/docs/video/api/rooms-resource
> Note: Rooms created via the REST API exist for five minutes to allow the first Participant to connect.
> If no Participants join within five minutes, the Room times out and a new Room must be created.

__Connecting Video must have https__ <br/>
When testing with Video, we must either run on localhost, or run on https, running on http won't work.
So let say you have a laptop at start the web server at localhost:3001, then your second device (mobile or laptop, for example) won't be able to connect with http.
On solution to test with second device is using [ngrok](https://ngrok.com/), you can register a free account and use it:
- Register a free account (free forever)
- Download 
- Connect to it by using the commandline provided by ngrok when you login into it's [dashboard](https://dashboard.ngrok.com/get-started/setup):
  `./ngrok authtoken xxxxxxxxx_your_auth_token_xxxxxxxxx`
- Then port forward it by using the command line:
  `ngrok http 3001 -host-header="localhost:3001"` (View more at https://stackoverflow.com/questions/45425721/invalid-host-header-when-ngrok-tries-to-connect-to-react-dev-server)


<p/>
__React Hooks__ <br/>
A very good deep dive understanding about useEffect: https://overreacted.io/a-complete-guide-to-useeffect/