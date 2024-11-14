import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Users from './pages/Users';
import Tasks from './pages/Tasks';
import Teams from './pages/Teams';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </Router>
  );
};

export default App;
