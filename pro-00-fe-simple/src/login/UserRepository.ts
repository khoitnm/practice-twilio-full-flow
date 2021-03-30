const userRepository = {
    setUsername: (username: string) => {
        sessionStorage.setItem("USER_NAME", username);
    },
    getUsername: (): string | undefined => {
        const username = sessionStorage.getItem("USER_NAME");
        return username || undefined;
    }
}
export default userRepository;