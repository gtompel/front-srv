// src/components/TaskForm.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createTask } from '../api'; // Предполагается, что у вас есть аналогичная API функция
import useStore from '../stores/useStore';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const setTasks = useStore((state) => state.setTasks); // Задайте аналогичный setTasks в Zustand

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = await createTask({ title, description });
      setTasks((prev) => [...prev, newTask]);
      toast.success('Task created successfully!');
      setTitle('');
      setDescription('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Task Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <button type="submit">Create Task</button>
    </form>
  );
};

export default TaskForm;
