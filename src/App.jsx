import './App.css'

function App() {

  return (
    <>
      <div className='container'>
        <div className='header-login'>
          <h1>Login de Admin</h1>
        </div>
        <form action="" className='formulario'>
          <div className='container-input'>
            <label htmlFor="email_login">Email:</label>
            <input type="text" name='email_login' id='email_login' placeholder='Digite seu email de login...'/>
          </div>
          <div className='container-input'>
            <label htmlFor="senha">Senha:</label>
            <input type="password" name="senha" id="senha" placeholder='digite sua senha' />
          </div>
          <button className='btn-entrar'>Entrar</button>
        </form>
      </div>
    </>
  )
}

export default App
