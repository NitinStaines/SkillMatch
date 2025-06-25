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

const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
  return (
    <>
    <Navbar />
    <Routes>

      <Route path='/register' element={<Register />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/dashboard' element={isAuthenticated() ? <Dashboard /> : <Navigate to='/login' />}/>
      <Route path='/connections' element={isAuthenticated() ? <Connection /> : <Navigate to='/login' />}/>
      <Route path='/skillProfile' element={isAuthenticated() ? <SkillProfile /> : <Navigate to='/login' />}/>
      <Route path='/addSkill' element={isAuthenticated() ? <AddSkill /> : <Navigate to='/login' />}/>
      <Route path='/chatRooms' element={isAuthenticated() ? <ChatRooms /> : <Navigate to='/login' />}/>
      <Route path='/chat/:roomId' element={isAuthenticated() ? <Chat /> : <Navigate to='/login' />}/>
      <Route path='/match' element={isAuthenticated() ? <Match /> : <Navigate to='/login' />}/>

    </Routes>
    </>
  );
}

export default App;
