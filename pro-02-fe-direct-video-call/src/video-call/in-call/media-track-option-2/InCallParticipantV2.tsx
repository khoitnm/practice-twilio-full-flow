import React, {useEffect, useRef, useState} from "react";
import {AudioTrack, LocalAudioTrack, LocalVideoTrack, Participant, VideoTrack} from "twilio-video";
import mediaTrackHelper from "../MediaTrackHelper";
import arrayHelper from "../../../common/util/ArrayHelper";
import ParticipantTracks from "./ParticipantTracks";

const TRACK_KIND_VIDEO = 'video';
const TRACK_KIND_AUDIO = 'audio';

export interface InCallParticipantV2Props {
  participant: Participant,
  isLocalParticipant?: boolean
}

/**
 * LocalParticipant means the main User who join the Video Room.
 *
 * With video, if we want to bind a videoTrack to <video> dom, we have to use something like {@link VideoTrack}.attach('#domId').
 * With ReactJS, we have to use `useRef()` approach.
 */
const InCallParticipantV2 = ({participant, isLocalParticipant}: InCallParticipantV2Props): JSX.Element => {


  return (
    <div className={'participant'}>
      <div className={'participant-header'}>
        <span className={'participant-name'}>{participant.identity} {isLocalParticipant && <span> (You)</span>}</span>

        {/*<button hidden={!isLocalParticipant} className={'participant-controller-button'} onClick={onMuteControl}>*/}
        {/*  <i hidden={!mute} className="bi bi-mic"></i>*/}
        {/*  <i hidden={mute} className="bi bi-mic-mute"></i>*/}
        {/*</button>*/}
        {/*<button hidden={!isLocalParticipant} className={'participant-controller-button'} onClick={onVideoControl}>*/}
        {/*  <i hidden={!videoDisplay} className="bi bi-camera-video"></i>*/}
        {/*  <i hidden={videoDisplay} className="bi bi-camera-video-off"></i>*/}
        {/*</button>*/}
      </div>
      <ParticipantTracks
        participant={participant}
        videoOnly={false}
        enableScreenShare={false}
        isLocalParticipant={isLocalParticipant}
      />
    </div>
  );
};

export default InCallParticipantV2;
