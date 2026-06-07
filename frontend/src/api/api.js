import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const getExperiences = async () => {
    const response = await axios.get(`${BASE_URL}/experiences`);
    return response.data;
};

export const getExperience = async (id) => {
    const response = await axios.get(`${BASE_URL}/experiences/${id}`);
    return response.data;
};

export const createExperience = async (data) => {
    const response = await axios.post(`${BASE_URL}/experiences`, data);
    return response.data;
};

export const updateExperience = async (id, data) => {
    const response = await axios.put(`${BASE_URL}/experiences/${id}`, data);
    return response.data;
};

export const deleteExperience = async (id) => {
    const response = await axios.delete(`${BASE_URL}/experiences/${id}`);
    return response.data;
};

export const getComments = async (experienceId) => {
    const response = await axios.get(`${BASE_URL}/experiences/${experienceId}/comments`);
    return response.data;
};

export const createComment = async (data) => {
    const response = await axios.post(`${BASE_URL}/comments`, data);
    return response.data;
};

export const getRoadmap = async (company, role) => {
    const response = await axios.get(`${BASE_URL}/roadmap`, {
        params: { company, role }
    });
    return response.data;
};

export const getProfile = async (userId) => {
    const response = await axios.get(`${BASE_URL}/profile/${userId}`);
    return response.data;
};

export const createOrUpdateProfile = async (data) => {
    const response = await axios.post(`${BASE_URL}/profile`, data);
    return response.data;
};

export const updateProfile = async (userId, data) => {
    const response = await axios.put(`${BASE_URL}/profile/${userId}`, data);
    return response.data;
};