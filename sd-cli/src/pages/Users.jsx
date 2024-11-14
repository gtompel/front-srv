import { useEffect } from 'react';
import { fetchUsers } from '../api';
import UserForm from '../components/UserForm';
import useStore from '../stores/useStore';
import { toast } from 'react-toastify';

const Users = () => {
  const users = useStore((state) => state.users);
  const setUsers = useStore((state) => state.setUsers);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Error fetching users');
      }
    };
    loadUsers();
  }, [setUsers]);

  return (
    <div>
      <h1>Users</h1>
      <UserForm />
      <ul>
        {users.map(user => (
          <li key={user.userId}>
            {user.username}
            {/* Кнопки для редактирования и удаления */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
