import axios from "axios";


const baseURL = 'https://pideteungas.com';

//const baseURL = 'http://192.168.100.100/gasapp-backend/public';

const gasAPI = axios.create({ baseURL });

export default gasAPI;