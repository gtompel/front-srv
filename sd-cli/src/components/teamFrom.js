import axios from "axios";
import { useState } from "react";

const TeamForm = ({ team, onSuccess }) => {
  const [teamName, setTeamName] = useState(team ? team.teamName : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = team ? `/api/teams/${team.id}` : `/api/teams`;
    const method = team ? "put" : "post";

    await axios({
      method,
      url,
      data: { teamName },
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" required />
      <button type="submit">{team ? "Update" : "Create"} Team</button>
    </form>
  );
};

export default TeamForm;
