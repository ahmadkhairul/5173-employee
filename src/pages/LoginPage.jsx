import { useState } from 'react'
import { login } from '../api/loginService'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState({ username: null, password: null })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(loginForm.username, loginForm.password)
      setError('')
      navigate('/employee', { replace: true })
    } catch (err) {
      setError('Login failed: ' + err.message)
    }
  }

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          name="username"
          value={loginForm.username}
          onChange={handleLoginChange}
          placeholder="Username"
          required
        />
        <input
          name="password"
          type="password"
          value={loginForm.password}
          onChange={handleLoginChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}