import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {AudioTrack, AudioTrackPublication, Participant, Room, Track, TrackPublication, VideoTrack, VideoTrackPublication} from "twilio-video";
import mediaTrackHelper from "./MediaTrackHelper";


export interface RemoteParticipantVideoProps {
  participant: Participant
}

const RemoteParticipantVideo = ({participant}: RemoteParticipantVideoProps): JSX.Element => {
  useEffect(() => {
    attachParticipantTracksToRef(participant);
  });

  const attachParticipantTracksToRef = (participant: Participant) => {
    mediaTrackHelper.attachParticipantTrackToRef(participant.videoTracks, videoRef);
    mediaTrackHelper.attachParticipantTrackToRef(participant.audioTracks, audioRef);
  }

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  return (
    <>
      {participant.identity}
      <video ref={videoRef} autoPlay={true}/>
      <audio ref={audioRef} autoPlay={true} muted={false}/>

      Participant: {JSON.stringify(participant)}<p/>
      {/*Video Tracks: {JSON.stringify(participant.videoTracks)}<p/>*/}
      {/*Audio Tracks: {JSON.stringify(participant.audioTracks)}<p/>*/}

    </>
  );
};

export default RemoteParticipantVideo;
