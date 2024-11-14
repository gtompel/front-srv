import axios from "axios";
import TeamForm from "../components/TeamForm";

const TeamsPage = ({ teams }) => {
  const [teamList, setTeamList] = useState(teams);
  const [editingTeam, setEditingTeam] = useState(null);

  const fetchTeams = async () => {
    const response = await axios.get("/api/teams");
    setTeamList(response.data);
  };

  const handleSuccess = () => {
    fetchTeams();
    setEditingTeam(null);
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
  };

  return (
    <div>
      <h1>Teams</h1>
      <TeamForm team={editingTeam} onSuccess={handleSuccess} />
      <ul>
        {teamList.map(team => (
          <li key={team.id}>
            {team.teamName} 
            <button onClick={() => handleEdit(team)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Fetch initial data
export const getServerSideProps = async () => {
  const response = await axios.get(`${process.env.API_URL}/teams`);
  return { props: { teams: response.data } };
};

export default TeamsPage;
