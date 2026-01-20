import axios from "axios";
import { Config } from "react-native-config";

//const baseURL = Config.BACKEND_URL;
const baseURL = 'https://customlaravel.xyz';

const gasAPI = axios.create({ baseURL });

export default gasAPI;