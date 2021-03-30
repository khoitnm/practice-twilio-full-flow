import userRepository from "./UserRepository";
import twilioAccessRepository from "../common/twilio/TwilioAccessRepository";

const authenticationService = {
    /**
     * @return username if it's authenticated.
     */
    validateAuthenticated: (): AuthenticatedUser => {
        const username: string | undefined = userRepository.getUsername();
        if (!username) {
            throw new Error("Username doesn't exist in userRepository. It should be set right after we login");
        }

        const twilioAccessToken = twilioAccessRepository.getTwilioAccessToken();
        if (!twilioAccessToken) {
            throw new Error("twilioAccessToken doesn't exist in twilioAccessRepository. It should be set right after we login");
        }
        return {username, twilioAccessToken};

    }
}
export default authenticationService;