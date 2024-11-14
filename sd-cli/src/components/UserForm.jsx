import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUser } from '../api';
import useStore from '../stores/useStore';

const UserForm = () => {
  const [username, setUsername] = useState('');
  const [cognitoId, setCognitoId] = useState('');
  const setUsers = useStore((state) => state.setUsers);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await createUser({ username, cognitoId });
      setUsers((prev) => [...prev, newUser]); // Обновите состояние пользователей
      toast.success('User created successfully!');
      setUsername('');
      setCognitoId('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Error creating user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text" 
        placeholder="Cognito ID" 
        value={cognitoId} 
        onChange={(e) => setCognitoId(e.target.value)} 
        required 
      />
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
      />
      <button type="submit">Create User</button>
    </form>
  );
};

export default UserForm;
