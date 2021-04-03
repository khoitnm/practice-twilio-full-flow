import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {AudioTrack, AudioTrackPublication, Participant, Room, Track, TrackPublication, VideoTrack, VideoTrackPublication} from "twilio-video";
import mediaTrackHelper from "./MediaTrackHelper";
import arrayHelper from "../common/util/ArrayHelper";

const TRACK_KIND_VIDEO = 'video';
const TRACK_KIND_AUDIO = 'audio';

export interface ParticipantVideoProps {
  participant: Participant,
  mute?: boolean
}

/**
 * LocalParticipant means the main User who join the Video Room.
 *
 * With video, if we want to bind a videoTrack to <video> dom, we have to use something like {@link Track}.attach('#domId').
 * With ReactJS, we have to use `useRef()` approach.
 */
const ParticipantVideo = ({participant, mute}: ParticipantVideoProps): JSX.Element => {
  const [videoTracks, setVideoTracks] = useState<Array<VideoTrack>>([]);
  const [audioTracks, setAudioTracks] = useState<Array<AudioTrack>>([]);

  useEffect(() => {
    //Note: And a new participant join a Room, he may not have track data yet (track items inside tracks array are still null, but track array is not null)
    // He only have data after a while.
    // Hence we'll need to register listeners to participant:
    //  - When there's a new track data, the component should be re-render.
    //  - It means we need to keep track data in component state.
    setVideoTracks(mediaTrackHelper.filterOutEmptyTracks(participant.videoTracks))
    setAudioTracks(mediaTrackHelper.filterOutEmptyTracks(participant.audioTracks))

    const onTrackSubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === TRACK_KIND_VIDEO) {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === TRACK_KIND_AUDIO) {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const onTrackUnsubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === TRACK_KIND_VIDEO) {
        setVideoTracks((videoTracks) => arrayHelper.newArrayExcludeItem(track, videoTracks));
      } else if (track.kind === TRACK_KIND_AUDIO) {
        setAudioTracks((audioTracks) => arrayHelper.newArrayExcludeItem(track, audioTracks));
      }
    };

    participant.on("trackSubscribed", onTrackSubscribed);
    participant.on("trackUnsubscribed", onTrackUnsubscribed);
    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;

  return (
    <div className={'participant'}>
      <div className={'participant-name'}>{participant.identity}</div>
      <video ref={videoRef} autoPlay={true} className={'participant-video'}/>
      <audio ref={audioRef} autoPlay={true} muted={mute}/>

      {/*Participant: {JSON.stringify(participant)}<p/>*/}
      {/*Video Tracks: {JSON.stringify(participant.videoTracks)}<p/>*/}
      {/*Audio Tracks: {JSON.stringify(participant.audioTracks)}<p/>*/}

    </div>
  );
};

export default ParticipantVideo;
