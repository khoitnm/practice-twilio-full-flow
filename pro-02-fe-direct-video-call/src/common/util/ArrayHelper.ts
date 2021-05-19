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

  /**
   * @return new array with replaced item.
   */
  replaceItem = (array: Array<any>, replacingItem: any, comparisonField: string): Array<any> => {
    const newArray = array.map((item) => {
      if (this.getField(item, comparisonField) === this.getField(replacingItem, comparisonField)) {
        return replacingItem;
      }
      return item;
    });
    return newArray;
  }

  getField(object: any, fieldsChainExpression: string) {
    const fields = fieldsChainExpression.split(".");
    let value = object;
    for (let field of fields) {
      if (!value) return undefined;
      value = value[field];
    }
    return value;
  }
}

const arrayHelper = new ArrayHelper();
export default arrayHelper;