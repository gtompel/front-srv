import axios from "axios";
import UserForm from "../components/UserForm";

const UsersPage = ({ users }) => {
  const [userList, setUserList] = useState(users);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const response = await axios.get("/api/users");
    setUserList(response.data);
  };

  const handleSuccess = () => {
    fetchUsers();
    setEditingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div>
      <h1>Users</h1>
      <UserForm user={editingUser} onSuccess={handleSuccess} />
      <ul>
        {userList.map(user => (
          <li key={user.userId}>
            {user.username} 
            <button onClick={() => handleEdit(user)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Fetch initial data
export const getServerSideProps = async () => {
  const response = await axios.get(`${process.env.API_URL}/users`);
  return { props: { users: response.data } };
};

export default UsersPage;
