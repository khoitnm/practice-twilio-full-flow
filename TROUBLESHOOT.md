## Testing many users connect to the same Video Room on local machine <br/>
__Problem:__ <br/>
If we want to connect many participants to the same Video Room on the same local machine with different Browsers,
those Browsers will try to use the same Camera device, and it will fail:
- Only the first participant can connect to it.
- The second participant won't be able to connect because of error `twilio AbortError: Starting video failed`

__Solution:__ <br/>
So we have to either test it on the same Browser (with different tabs), or we have to connect to multiple cameras devices. 

## No WebSocket connection when using `room.disconnect()`
__Problem__ <br/>
This method `room?.disconnect()` throw an exception: cannot connect because of no WebSocket connection.

__Root cause and solution__ <br/>
If we executed this code before that: 
```
const joinedRoom = await joinOrStartRoom(existToken, roomName);
setRoom({...joinedRoom} as Room); 
```
That new `{...joinedRoom}` state is just a new pure JavaScript object, it won't keep any WebSocket connection anymore.
So the correct way to do it is:
```
const joinedRoom = await joinOrStartRoom(existToken, roomName);
setRoom(joinedRoom); 
```
<p/>
----------
However, when log out, we have to use:
``` 
    const disconnectedRoom = room?.disconnect();
    setRoom({...disconnectedRoom} as Room);
```
Both `disconnectedRoom` and current `room` actually are referring to the same object memory.
Hence, doing this `setRoom(disconnectedRoom)` won't make ReactJS rerender the new values inside joinedRoom.