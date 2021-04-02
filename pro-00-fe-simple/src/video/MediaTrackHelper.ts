import {AudioTrackPublication, Participant, VideoTrackPublication} from "twilio-video";
import {MutableRefObject} from "react";



const mediaTrackHelper = {
  filterOutEmptyTracks: (trackMap: Map<string, unknown>) => {
    return Array.from(trackMap.values())
      .map((publication: any) => publication.track)
      .filter((track) => track !== null);
  },

  attachParticipantTrackToRef: (tracksMap: Map<string, VideoTrackPublication | AudioTrackPublication>, ref: MutableRefObject<any>) => {
    const tracks = mediaTrackHelper.filterOutEmptyTracks(tracksMap);
    if (tracks.length > 0){
      const track = tracks[0];
      track.attach(ref.current);
    }
  }

}
export default mediaTrackHelper;