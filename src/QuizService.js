import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/quiz'; // ✅ Correct base URL
const API_URL = 'http://localhost:8080/api/questions'; // ✅ For questions

// ✅ Get All Quizzes
export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

// ✅ Create a Quiz
export const createQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    return null;
  }
};

// ✅ Delete a Quiz
export const deleteQuiz = async (quizId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${quizId}`);
    return true;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return false;
  }
};

// ✅ Get Quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
};

// ✅ Update an existing quiz
export const updateQuiz = async (id, quiz) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, quiz);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

// ✅ Get questions for a quiz by quizId
export const getQuizQuestions = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/fetch/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// ✅ Submit quiz answers and calculate score with userId
// ✅ Submit quiz answers with quizId and userId
export const submitQuiz = async (quizId, userId, answers) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/questions/submit/${quizId}/${userId}`,
      answers
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

// ✅ Like a Quiz
export const likeQuiz = async (quizId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${quizId}/like/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error liking quiz:', error);
    throw error;
  }
};

// ✅ Unlike a Quiz
export const unlikeQuiz = async (quizId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${quizId}/unlike/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error unliking quiz:', error);
    throw error;
  }
};

// ✅ Get Liked Quizzes for a User
export const getLikedQuizzesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/liked/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked quizzes:', error);
    return [];
  }
};