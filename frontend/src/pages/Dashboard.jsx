import React, {useEffect, useState} from 'react';
import api from '../api/client';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Dashboard(){
  const [counts, setCounts] = useState([]);
  const [avg, setAvg] = useState(null);

  const fetch = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/reports/counts-by-status', { headers: { Authorization: `Bearer ${token}` } });
    setCounts(res.data.map(r=> ({name: r.estado, value: r.count} )));
    const r2 = await api.get('/reports/avg-time-attention', { headers: { Authorization: `Bearer ${token}` } });
    setAvg(r2.data);
  };

  useEffect(()=>{ fetch(); }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{display:'flex', gap:40}}>
        <div>
          <h3>Documentos por estado</h3>
          <PieChart width={300} height={300}>
            <Pie data={counts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
              {counts.map((entry, index) => <Cell key={index} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <h3>Tiempo promedio de atención</h3>
          {avg && <p>{avg.averageMs ? (Math.round(avg.averageMs/1000/60)) + ' minutos (media)' : 'No hay datos'}</p>}
        </div>
      </div>
    </div>
  )
}
