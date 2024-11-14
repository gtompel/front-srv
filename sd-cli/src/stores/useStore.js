import create from 'zustand';

const useStore = create((set) => ({
  users: [],
  tasks: [],
  teams: [],
  setUsers: (users) => set({ users }),
  setTasks: (tasks) => set({ tasks }),
  setTeams: (teams) => set({ teams }),
}));

export default useStore;
