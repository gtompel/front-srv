import axios from "axios";
import TaskForm from "../components/TaskForm";

const TasksPage = ({ tasks }) => {
  const [taskList, setTaskList] = useState(tasks);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const response = await axios.get("/api/tasks");
    setTaskList(response.data);
  };

  const handleSuccess = () => {
    fetchTasks();
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm task={editingTask} onSuccess={handleSuccess} />
      <ul>
        {taskList.map(task => (
          <li key={task.id}>
            {task.title} 
            <button onClick={() => handleEdit(task)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Fetch initial data
export const getServerSideProps = async () => {
  const response = await axios.get(`${process.env.API_URL}/tasks`);
  return { props: { tasks: response.data } };
};

export default TasksPage;
