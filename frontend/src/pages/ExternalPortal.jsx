import React, { useState } from 'react';
import api from '../api/client';

export default function ExternalPortal(){
  const [tramite, setTramite] = useState('');
  const [result, setResult] = useState(null);

  const buscar = async ()=> {
    try {
      const res = await api.get(`/documents/public/${tramite}`);
      setResult(res.data);
    } catch (e) {
      alert('No encontrado');
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Consulta de Trámite (Público)</h2>
      <input value={tramite} onChange={e=>setTramite(e.target.value)} placeholder="Número de trámite"/>
      <button onClick={buscar}>Buscar</button>

      {result && (
        <div style={{marginTop:20}}>
          <p><strong>Trámite:</strong> {result.tramite}</p>
          <p><strong>Estado:</strong> {result.estado}</p>
          <h4>Movimientos</h4>
          <ul>
            {result.movimientos.map(m=> <li key={m.id}>{m.action} - {m.toRole} - {m.note || ''}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
