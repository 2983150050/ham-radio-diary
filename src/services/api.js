import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createCommunication = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/communications`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating communication:', error);
    throw error;
  }
};

export const getCommunications = async () => {
  try {
    const response = await axios.get(`${API_URL}/communications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

export const deleteCommunication = async (id) => {
  try {
    await axios.delete(`${API_URL}/communications/${id}`);
  } catch (error) {
    console.error('Error deleting communication:', error);
    throw error;
  }
};