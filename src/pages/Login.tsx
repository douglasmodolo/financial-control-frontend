import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'


const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { login } = useAuth()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!email || !password) {
            setError('Preencha email e senha')
            return
        }
        setLoading(true)
        try {
            const resp = await api.post('/api/users/login', { email, password })
            const token = resp.data?.token
            if (!token) throw new Error('Token não encontrado na resposta')
            login(token)
            navigate('/', { replace: true })
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Erro ao efetuar login')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div style={{ maxWidth: 420, margin: '60px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            <h1>Entrar</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                    />
                </div>


                <div style={{ marginBottom: 12 }}>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
                    />
                </div>


                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}


                <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>


            <div style={{ marginTop: 12 }}>
                Não tem conta? <Link to="/register">Registre-se</Link>
            </div>
        </div>
    )
}


export default Login