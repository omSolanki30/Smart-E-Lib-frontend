import axios from 'axios';

// Backend URL for fetching books
const API_URL = `${import.meta.env.VITE_API_URL}api/books`;

export const fetchBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};