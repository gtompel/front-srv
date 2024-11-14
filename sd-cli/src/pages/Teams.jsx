import { useEffect } from 'react';
import { fetchTeams } from '../api'; 
import TeamForm from '../components/TeamForm'; // Убедитесь, что этот импорт правильный
import useStore from '../stores/useStore';
import { toast } from 'react-toastify';

const Teams = () => {
  const teams = useStore((state) => state.teams);
  const setTeams = useStore((state) => state.setTeams);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams(); 
        setTeams(data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Error fetching teams');
      }
    };
    loadTeams();
  }, [setTeams]);

  return (
    <div>
      <h1>Teams</h1>
      <TeamForm />
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            {team.teamName}
            {/* Кнопки для редактирования и удаления */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
