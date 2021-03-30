const envHelper = {
    /**
     * Get a property from env.
     * If it doesn't exist, throw an exception.
     * @param propertyName
     */
    getRequiredProperty: (propertyName: string): string => {
        let propertyValue = process.env[propertyName];
        if (propertyValue) {
            return propertyValue;
        } else {
            throw new Error(`Property ${propertyName} doesn't exist in process.env`);
        }
    }
}
export default envHelper;