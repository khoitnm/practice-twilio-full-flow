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
- Change camera devices: https://www.twilio.com/blog/2018/06/switching-cameras-twilio-video-chat.html
- Mute/Unmute Video and Audio: https://www.twilio.com/blog/add-muting-unmuting-video-chat-app-30-seconds
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

<p/>
__React Hooks__ <br/>
A very good deep dive understanding about useEffect: https://overreacted.io/a-complete-guide-to-useeffect/