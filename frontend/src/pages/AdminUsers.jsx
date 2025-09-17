import React, {useEffect, useState} from 'react';
import api from '../api/client';

export default function AdminUsers(){
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({name:'', email:'', password:'', role:'area'});

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/users', { headers: { Authorization: `Bearer ${token}` } });
    setUsers(res.data);
  };

  useEffect(()=>{ fetchUsers(); }, []);

  const createUser = async () => {
    const token = localStorage.getItem('token');
    await api.post('/users', form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({name:'',email:'',password:'',role:'area'});
    fetchUsers();
  };

  const del = async (id) => {
    const token = localStorage.getItem('token');
    await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <div>
      <h2>Admin - Usuarios</h2>
      <div style={{marginBottom:20}}>
        <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="admin">admin</option>
          <option value="mesa">mesa</option>
          <option value="area">area</option>
          <option value="externo">externo</option>
        </select>
        <button onClick={createUser}>Crear</button>
      </div>
      <table border="1" cellPadding="6">
        <thead><tr><th>Id</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acción</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
              <td><button onClick={()=>del(u.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
