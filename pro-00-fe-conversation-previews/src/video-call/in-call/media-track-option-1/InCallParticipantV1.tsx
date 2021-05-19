import React, {useEffect, useRef, useState} from "react";
import {AudioTrack, LocalAudioTrack, LocalVideoTrack, Participant, VideoTrack} from "twilio-video";
import mediaTrackHelper from "../MediaTrackHelper";
import arrayHelper from "../../../common/util/ArrayHelper";

const TRACK_KIND_VIDEO = 'video';
const TRACK_KIND_AUDIO = 'audio';

export interface InCallParticipantV1Props {
  participant: Participant,
  isLocalParticipant?: boolean
}

/**
 * LocalParticipant means the main User who join the Video Room.
 *
 * With video, if we want to bind a videoTrack to <video> dom, we have to use something like {@link VideoTrack}.attach('#domId').
 * With ReactJS, we have to use `useRef()` approach.
 */
const InCallParticipantV1 = ({participant, isLocalParticipant}: InCallParticipantV1Props): JSX.Element => {
  const [videoTracks, setVideoTracks] = useState<Array<VideoTrack>>([]);
  const [audioTracks, setAudioTracks] = useState<Array<AudioTrack>>([]);
  const [audioMute, setAudioMute] = useState<boolean>(!isLocalParticipant);
  const [videoDisplay, setVideoDisplay] = useState<boolean>(true);

  useEffect(() => {
    //Note: And a new participant join a Room, he may not have track data yet (track items inside tracks array are still null, but track array is not null)
    // He only have data after a while.
    // Hence we'll need to register listeners to participant:
    //  - When there's a new track data, the component should be re-render.
    //  - It means we need to keep track data in component state.
    console.log(`useEffect: AudioTrack of participant ${participant.identity}: ${JSON.stringify(participant.audioTracks)}`);
    setVideoTracks(mediaTrackHelper.filterOutEmptyTracks(participant.videoTracks))
    setAudioTracks(mediaTrackHelper.filterOutEmptyTracks(participant.audioTracks))

    const onTrackSubscribed = (track: VideoTrack | AudioTrack) => {
      console.log(`onTrackSubscribed: subscribed track ${track}`);

      if (track.kind === TRACK_KIND_VIDEO) {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === TRACK_KIND_AUDIO) {
        if (!isLocalParticipant) {
          setAudioTracks((audioTracks) => [...audioTracks, track]);
          console.log(`onTrackSubscribed: AudioTrack of participant ${participant.identity}:
          subscribedTrack: ${JSON.stringify(track)}
          tracks: ${JSON.stringify(participant.audioTracks)}`);
        }
      }
    };

    const onTrackUnsubscribed = (track: VideoTrack | AudioTrack) => {
      if (track.kind === TRACK_KIND_VIDEO) {
        setVideoTracks((videoTracks) => arrayHelper.newArrayExcludeItem(track, videoTracks));
      } else if (track.kind === TRACK_KIND_AUDIO) {
        setAudioTracks((audioTracks) => arrayHelper.newArrayExcludeItem(track, audioTracks));
        console.log(`onTrackUnsubscribed: AudioTrack of participant ${participant.identity}:
          unSubscribedTrack: ${JSON.stringify(track)}
          tracks: ${JSON.stringify(participant.audioTracks)}`);
      }
    };

    participant.on("trackSubscribed", onTrackSubscribed);
    participant.on("trackUnsubscribed", onTrackUnsubscribed);
    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
      console.log(`Clean up tracks when unmount participant`);
    };
  }, [isLocalParticipant, participant]);

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
    console.log(`useEffect[audioTracks]: ${JSON.stringify(audioTracks)}`);
    if (!isLocalParticipant && audioTrack) {
      audioTrack?.attach(audioRef.current);
    }
    return () => {
      audioTrack?.detach();
    };
  }, [isLocalParticipant, audioTracks]);

  const onAudioMuteControl = () => {
    if (!isLocalParticipant) return;
    const updatedMediaTracks = enableTracks(audioTracks, !audioMute);
    setAudioTracks(updatedMediaTracks as Array<AudioTrack>);
    setAudioMute(!audioMute);
  }

  const onVideoEnableControl = () => {
    if (!isLocalParticipant) return;
    const updatedMediaTracks = enableTracks(videoTracks, !videoDisplay);
    setVideoTracks(updatedMediaTracks as Array<VideoTrack>);
    setVideoDisplay(!videoDisplay);
  }

  const enableTracks = (tracks: Array<AudioTrack | VideoTrack>, enable: boolean): Array<AudioTrack | VideoTrack> => {
    const newTrack: Array<AudioTrack | VideoTrack> = [];
    tracks.forEach((track: AudioTrack | VideoTrack) => {
      let localTrack = track as LocalAudioTrack | LocalVideoTrack;
      if (enable) {
        localTrack = localTrack.enable();
      } else {
        localTrack = localTrack.disable();
      }
      newTrack.push(localTrack);
    });
    return newTrack;
  }


  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;


  return (
    <div className={'participant pb-2'}>
      <div className={'participant-header'}>
        <span className={'participant-name'}>{participant.identity} {isLocalParticipant && <span> (You)</span>}</span>

        {/*<button hidden={!isLocalParticipant} className={'participant-controller-button'} onClick={onAudioMuteControl}>*/}
        {/*  <i hidden={!audioMute} className="bi bi-mic"></i>*/}
        {/*  <i hidden={audioMute} className="bi bi-mic-mute"></i>*/}
        {/*</button>*/}
        <button hidden={!isLocalParticipant} className={'participant-controller-button'} onClick={onVideoEnableControl}>
          <i hidden={!videoDisplay} className="bi bi-camera-video"></i>
          <i hidden={videoDisplay} className="bi bi-camera-video-off"></i>
        </button>
      </div>
      <video ref={videoRef} autoPlay={true} className={'participant-video'}/>
      {!isLocalParticipant && <audio ref={audioRef} autoPlay={true} muted={true}/>}
    </div>
  );
};

export default InCallParticipantV1;
