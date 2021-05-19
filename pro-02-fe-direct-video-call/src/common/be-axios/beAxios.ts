import axios from 'axios';

/**
 * The client code to our backend.
 */
const beAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});
export default beAxios;
