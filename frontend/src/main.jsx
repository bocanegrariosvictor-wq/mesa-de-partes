import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import RegisterDocument from './pages/RegisterDocument'
import ExternalPortal from './pages/ExternalPortal'
import AdminUsers from './pages/AdminUsers'
import Dashboard from './pages/Dashboard'

function App(){
  return (
    <BrowserRouter>
      <div style={{padding:20}}>
        <nav style={{marginBottom:20}}>
          <Link to="/">Login</Link> | <Link to="/register">Registrar</Link> | <Link to="/external">Portal Externo</Link> | <Link to="/admin">Admin</Link> | <Link to="/dashboard">Dashboard</Link>
        </nav>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<RegisterDocument/>} />
          <Route path='/external' element={<ExternalPortal/>} />
          <Route path='/admin' element={<AdminUsers/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
