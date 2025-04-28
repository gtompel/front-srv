import axios from "axios";
import { useState } from "react";

const TaskForm = ({ task, onSuccess }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [priority, setPriority] = useState(task ? task.priority : "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = task ? `/api/tasks/${task.id}` : `/api/tasks`;
    const method = task ? "put" : "post";

    await axios({
      method,
      url,
      data: { title, description, priority },
    });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="Priority" />
      <button type="submit">{task ? "Update" : "Create"} Task</button>
    </form>
  );
};

export default TaskForm;
