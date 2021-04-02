const arrayHelper = {
  newArrayExcludeItem: (removingItem: any, array: Array<any>): Array<any> => {
    return array.filter((element) => element !== removingItem);
  }

}
export default arrayHelper;