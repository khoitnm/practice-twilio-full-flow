const mediaTrackHelper = {
  filterOutEmptyTracks: (trackMap: Map<string, unknown>) => {
    return Array.from(trackMap.values())
      .map((publication: any) => publication.track)
      .filter((track) => track !== null);
  },
}
export default mediaTrackHelper;