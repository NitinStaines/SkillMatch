import {useState} from "react";
import axios from "axios";
import './Login.css'

function Login(){

    const [form, setForm] = useState({email: '', password: ''});

    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    };

    async function handleSubmit(e){
        e.preventDefault();

        try{
            const res = await axios.post('http://localhost:5000/api/auth/Login', form);
            localStorage.setItem('token', res.data.token);
            alert(`Welcome, ${res.data.user.name}`);

        }catch(err){
            alert(err.response.data.message || 'Login failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="Login">
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    )
};

export default Login;
