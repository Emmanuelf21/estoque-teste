import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Estoque from './components/Estoque'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate() // <-- usado para redirecionar

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      setMensagem("❌ " + (data.detail || "Erro de login"))
    } else {
      setMensagem("✅ " + data.msg)
      navigate('/estoque') // <-- redireciona para Estoque.jsx
    }
  };

  return (
    <div className='container'>
      <div className='header-login'>
        <h1>Login de Admin</h1>
      </div>
      <form className='formulario' onSubmit={handleSubmit}>
        <div className='container-input'>
          <label htmlFor="email_login">Email:</label>
          <input
            type="text"
            id="email_login"
            placeholder='Digite seu email de login...'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='container-input'>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            placeholder='Digite sua senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit" className='btn-entrar'>Entrar</button>
        {mensagem && <p>{mensagem}</p>}
      </form>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </Router>
  )
}

export default App
