import axios from "axios";


const baseURL = 'http://prosperocrecer.com';

const gasAPI = axios.create({ baseURL });

export default gasAPI;