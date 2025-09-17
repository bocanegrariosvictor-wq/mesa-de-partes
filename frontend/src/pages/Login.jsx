import React, {useState} from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({email:'admin@demo.local', password:'admin123'});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);
    alert('Login OK: ' + res.data.user.name);
    nav('/register');
  };

  return (
    <form onSubmit={submit} style={{maxWidth:400}}>
      <h2>Login Demo</h2>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="block"/>
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="block"/>
      <button type="submit">Entrar</button>
    </form>
  )
}
