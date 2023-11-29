import axios from 'axios'

const API_URL = 'http://localhost:3001/';

const profileId = localStorage.getItem('loggedUser');

export const fetchGet = (endpoint: string) => axios.get(`${API_URL}${endpoint}`, {
    headers: {
        ...(profileId ? {profile_id: profileId} : {})
    }
}).then(res => res.data)
export const sendRequest = (endpoint: string, {arg}) => axios.post(`${API_URL}${endpoint}`, arg, {
    headers: {
        ...(profileId ? {profile_id: profileId} : {})
    }
}).then(res => res.data)