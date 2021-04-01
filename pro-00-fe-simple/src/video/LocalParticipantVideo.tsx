import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {AudioTrack, AudioTrackPublication, Participant, Room, Track, TrackPublication, VideoTrack, VideoTrackPublication} from "twilio-video";


export interface LocalParticipantVideoProps {
  participant: Participant
}

/**
 * With video, if we want to bind a videoTrack to <video> dom, we have to use something like {@link Track}.attach('#domId').
 * With ReactJS, we have to use `useRef()` approach.
 */
const LocalParticipantVideo = ({participant}: LocalParticipantVideoProps): JSX.Element => {
  // const [videoTracks, setVideoTracks] = useState<Array<VideoTrack>>([]);
  // const [audioTracks, setAudioTracks] = useState<Array<AudioTrack>>([]);

  const filterOutEmptyTracks = (trackMap: Map<string, unknown>) => {
    return Array.from(trackMap.values())
      .map((publication: any) => publication.track)
      .filter((track) => track !== null);
  }

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
    attachParticipantTrackToRef(participant.videoTracks, videoRef);
    attachParticipantTrackToRef(participant.audioTracks, audioRef);
  }

  const attachParticipantTrackToRef = (tracksMap: Map<string, VideoTrackPublication | AudioTrackPublication>, ref: MutableRefObject<any>) => {
    const tracks = filterOutEmptyTracks(tracksMap);
    if (tracks.length > 0){
      const track = tracks[0];
      track.attach(ref.current);
    }
  }

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  return (
    <>
      {participant.identity}
      <video ref={videoRef} autoPlay={true}/>
      <audio ref={audioRef} autoPlay={true} muted={true}/>
    </>
  );
};

export default LocalParticipantVideo;
