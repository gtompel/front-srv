import { useState } from 'react';
import { toast } from 'react-toastify';
import { createTeam } from '../api';
import useStore from '../stores/useStore';  // Импортируйте useStore правильно

const TeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const setTeams = useStore((state) => state.setTeams);  // Используем хуки таким образом

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTeam = await createTeam({ teamName });
      setTeams((prev) => [...prev, newTeam]);  // Обновляем состояние команд
      toast.success('Team created successfully!');
      setTeamName('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Error creating team');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        required
      />
      <button type="submit">Create Team</button>
    </form>
  );
};

export default TeamForm;
