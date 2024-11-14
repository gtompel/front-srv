import { useEffect } from 'react';
import { fetchTasks } from '../api'; 
import TaskForm from '../components/TaskForm';
import useStore from '../stores/useStore';
import { toast } from 'react-toastify';

const Tasks = () => {
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks(); 
        setTasks(data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Error fetching tasks');
      }
    };
    loadTasks();
  }, [setTasks]);

  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm />
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            {/* Кнопки для редактирования и удаления */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
