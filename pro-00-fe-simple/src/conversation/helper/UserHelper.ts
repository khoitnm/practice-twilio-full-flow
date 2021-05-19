import BeUser from "../../common/twilio/conversation/BeUser";

const userHelper = {
  excludeUserIdentity: (users: Array<BeUser>, excludedUserIdentity: string): Array<BeUser> => {
    const result = users.filter(user => user.identity !== excludedUserIdentity);
    return result;
  }
}
export default userHelper;