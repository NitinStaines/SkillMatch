import {useState} from "react";
import axios from "axios";
import './Register.css'

function Register(){

    const [form, setForm] = useState({name: '', email: '', password: ''});

    function handleChange(e){
        setForm({...form, [e.target.name]: e.target.value});
    };

    async function handleSubmit(e){
        e.preventDefault();

        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', form);
            alert(res.data.message)
        }catch(err){
            alert(err.response.data.message || 'Error while registering');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Register</button>
        </form>
    )
};

export default Register;
