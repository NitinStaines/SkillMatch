import './App.css'
import { Routes, Route , Navigate} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Connection from './pages/Connections';
import SkillProfile from './pages/SkillProfile';
import AddSkill from './pages/AddSkill'
import ChatRooms from './pages/ChatRooms';
import Chat from './pages/Chat';
import Match from './pages/Match';
import PrivateRoute from "./components/PrivateRoute";
import ViewProfile from './pages/ViewProfile';

const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
    return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/connections"
        element={
          <PrivateRoute>
            <Connection />
          </PrivateRoute>
        }
      />
      <Route
        path="/skillProfile"
        element={
          <PrivateRoute>
            <SkillProfile />
          </PrivateRoute>
        }
      />
      <Route
        path="/addSkill"
        element={
          <PrivateRoute>
            <AddSkill />
          </PrivateRoute>
        }
      />
      <Route
        path="/chatRooms"
        element={
          <PrivateRoute>
            <ChatRooms />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:roomId"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/match"
        element={
          <PrivateRoute>
            <Match />
          </PrivateRoute>
        }
      />
      <Route
        path="skillProfile/user/:userId"
        element={
          <PrivateRoute>
            <ViewProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
