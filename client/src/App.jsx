import './App.css'
import { Routes, Route , Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import Home from './pages/Home';
import ServerDown from './components/ServerDown';
import useServerStatus from './hooks/useServerStatus';

const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
  const { isServerOnline, isChecking, hasShownServerDown, checkServerStatus, clearTokenAndRedirect } = useServerStatus();

  // Show server down page if server is down and user is authenticated
  const token = localStorage.getItem('token');
  const shouldShowServerDown = !isServerOnline && token && hasShownServerDown;

  if (shouldShowServerDown) {
    return <ServerDown onRetry={checkServerStatus} isChecking={isChecking} onLogout={clearTokenAndRedirect} />;
  }

  if (isChecking && token) {
    return (
      <div style={{
        background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Checking server connection...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={ <Home />} />
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
