import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {AudioTrack, AudioTrackPublication, Participant, Room, Track, TrackPublication, VideoTrack, VideoTrackPublication} from "twilio-video";
import mediaTrackHelper from "./MediaTrackHelper";


export interface LocalParticipantVideoProps {
  participant: Participant
}

/**
 * LocalParticipant means the main User who join the Video Room.
 *
 * With video, if we want to bind a videoTrack to <video> dom, we have to use something like {@link Track}.attach('#domId').
 * With ReactJS, we have to use `useRef()` approach.
 */
const LocalParticipantVideo = ({participant}: LocalParticipantVideoProps): JSX.Element => {
  // const [videoTracks, setVideoTracks] = useState<Array<VideoTrack>>([]);
  // const [audioTracks, setAudioTracks] = useState<Array<AudioTrack>>([]);

  useEffect(() => {
    attachParticipantTracksToRef(participant);
  });
  //
  // useEffect(() => {
  //   const videoTrack = videoTracks[0];
  //   if (videoTrack) {
  //     videoTrack.attach(videoRef.current);
  //     return () => {
  //       videoTrack.detach();
  //     };
  //   }
  // }, [videoTracks]);
  //
  // useEffect(() => {
  //   const audioTrack = audioTracks[0];
  //   if (audioTrack) {
  //     audioTrack.attach(audioRef.current);
  //     return () => {
  //       audioTrack.detach();
  //     };
  //   }
  // }, [audioTracks]);

  const attachParticipantTracksToRef = (participant: Participant) => {
    mediaTrackHelper.attachParticipantTrackToRef(participant.videoTracks, videoRef);
    mediaTrackHelper.attachParticipantTrackToRef(participant.audioTracks, audioRef);
  }

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  return (
    <div className={'participant bg-secondary text-light'}>
      {participant.identity}
      <video ref={videoRef} autoPlay={true} className={'participant-video'}/>
      <audio ref={audioRef} autoPlay={true} muted={false}/>

      {/*Participant: {JSON.stringify(participant)}<p/>*/}
      {/*Video Tracks: {JSON.stringify(participant.videoTracks)}<p/>*/}
      {/*Audio Tracks: {JSON.stringify(participant.audioTracks)}<p/>*/}

    </div>
  );
};

export default LocalParticipantVideo;
