import axios from "axios";

export default async function handler(req, res) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // задайте URL API

  if (req.method === "GET") {
    const response = await axios.get(`${API_URL}/tasks`);
    return res.status(200).json(response.data);
  } else if (req.method === "POST") {
    const response = await axios.post(`${API_URL}/tasks`, req.body);
    return res.status(201).json(response.data);
  }
}

// Дополните этот обработчик для PUT и DELETE методов
