class ImmutableMapHelper {

  plusNumValueInMap(originalMap: Map<string, number>, key: string, plusValue: number): Map<string, number> {
    let prevCount = originalMap.get(key);
    if (!prevCount) {
      prevCount = 0;
    }
    return new Map(originalMap).set(key, prevCount + plusValue)
  }
}

const immutableMapHelper = new ImmutableMapHelper();
export default immutableMapHelper;