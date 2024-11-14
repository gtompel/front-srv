import axios from "axios";
import { useState } from "react";

const UserForm = ({ user, onSuccess }) => {
  const [cognitoId, setCognitoId] = useState(user ? user.cognitoId : "");
  const [username, setUsername] = useState(user ? user.username : "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(user ? user.profilePictureUrl : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = user ? `/api/users/${user.userId}` : `/api/users`;
    const method = user ? "put" : "post";

    await axios({
      method,
      url,
      data: { cognitoId, username, profilePictureUrl },
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={cognitoId} onChange={(e) => setCognitoId(e.target.value)} placeholder="Cognito ID" required />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} placeholder="Profile Picture URL" />
      <button type="submit">{user ? "Update" : "Create"} User</button>
    </form>
  );
};

export default UserForm;
