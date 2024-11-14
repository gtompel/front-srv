import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Задайте ваш API URL
});

// Функция для получения пользователей
export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Функция для создания пользователя
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// Функция для удаления пользователя
export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`);
};

// Функция для получения задач
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Функция для создания задачи
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Функция для удаления задачи
export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

// Функция для получения команд
export const fetchTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

// Функция для создания команды
export const createTeam = async (teamData) => {
  const response = await api.post('/teams', teamData);
  return response.data;
};

// Функция для удаления команды
export const deleteTeam = async (teamId) => {
  await api.delete(`/teams/${teamId}`);
};
