import React, { useState } from 'react';
import api from '../api/client';

export default function RegisterDocument() {
  const [form, setForm] = useState({ remitente: '', destinatario: '', asunto: '', tipo: '' });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('remitente', form.remitente);
    data.append('destinatario', form.destinatario);
    data.append('asunto', form.asunto);
    data.append('tipo', form.tipo);
    if (file) data.append('file', file);
    const token = localStorage.getItem('token');
    const res = await api.post('/documents', data, { headers: { Authorization: `Bearer ${token}` } });
    alert('Documento registrado: ' + res.data.doc.tramiteNumber);
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:600}}>
      <h2>Registrar Documento (Demo)</h2>
      <input placeholder="Remitente" value={form.remitente} onChange={e=>setForm({...form, remitente:e.target.value})} className="block"/>
      <input placeholder="Destinatario" value={form.destinatario} onChange={e=>setForm({...form, destinatario:e.target.value})} className="block"/>
      <input placeholder="Tipo" value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})} className="block"/>
      <textarea placeholder="Asunto" value={form.asunto} onChange={e=>setForm({...form, asunto:e.target.value})} className="block"/>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button type="submit">Registrar</button>
    </form>
  );
}
