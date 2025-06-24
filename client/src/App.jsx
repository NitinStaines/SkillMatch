import './App.css'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'

const isAuthenticated = () => !!localStorage.getItem('token');


function App() {
  return (
    <Routes>
      <Route path='/' element={<h1>Home</h1>}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/dashboard' element={isAuthenticated() ? <Dashboard /> : <Navigate to='/login' />}
      />
    </Routes>
  );
}

export default App;
