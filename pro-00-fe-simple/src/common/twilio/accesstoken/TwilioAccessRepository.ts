const twilioAccessRepository = {
    setTwilioAccessToken: (accessToken: string) => {
        sessionStorage.setItem("TWILIO_ACCESS_TOKEN", accessToken);
    },
    getTwilioAccessToken: (): string | undefined => {
        const accessToken = sessionStorage.getItem("TWILIO_ACCESS_TOKEN");
        return accessToken || undefined;
    }
}
export default twilioAccessRepository;