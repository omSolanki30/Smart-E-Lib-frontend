import axios from 'axios';

// Backend URL for fetching books
const API_URL = 'http://localhost:5000/api/books';

export const fetchBooks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};