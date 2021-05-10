class ArrayHelper {
  newArrayExcludeItem = (removingItem: any, array: Array<any>): Array<any> => {
    return array.filter((element) => element !== removingItem);
  }
  toArray = (iterableIterator?: IterableIterator<any>): Array<any> | undefined => {
    if (!iterableIterator) {
      return undefined;
    }
    // @ts-ignore
    // It's already supported in new es6 https://github.com/Microsoft/TypeScript/issues/9030
    const array: Array<any> = Array.from(iterableIterator);
    return array;
  }
  toDefinedArray = (iterableIterator?: IterableIterator<any>): Array<any> => {
    let result = this.toArray(iterableIterator);
    if (!result) {
      result = [];
    }
    return result;
  }
}

export default new ArrayHelper();