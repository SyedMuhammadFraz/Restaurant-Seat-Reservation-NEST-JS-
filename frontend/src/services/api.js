import axios from "axios";

const API_URL = 'http://localhost:3001'; 

export const checkEmail = (email) => {
  return axios.get(`${API_URL}/users/byemail`, { params: { email } });
};


export const signup = async (data) => {
    return axios.post(`${API_URL}/users`, data);
  };