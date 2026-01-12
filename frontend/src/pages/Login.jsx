import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from '../components/Icons';
import './Login.css';

const Login = () => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Se vier do cadastro com username, focar no campo de senha
        if (location.state?.username) {
            document.getElementById('password')?.focus();
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            await login(username, password);
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login:', error);

            if (error.response?.status === 401) {
                toast.error('Usuário ou senha inválidos');
            } else if (error.response?.status === 403) {
                toast.error('Conta bloqueada por excesso de tentativas');
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEsqueciSenha = () => {
        toast.info('Funcionalidade em desenvolvimento');
    };

    const handleCadastrar = () => {
        navigate('/cadastro');
    };

    return (
        <div className="studium-container">
            <div className="studium-main-card">
                <div className="studium-page-header">
                    <h1 className="studium-form-title login-form-title">Studium</h1>
                </div>

                <form onSubmit={handleSubmit} className="studium-form">
                    <div className="studium-form-group">
                        <label htmlFor="usuario" className="studium-form-label login-form-label">
                            Usuário
                        </label>
                        <input
                            id="usuario"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="studium-form-input"
                            placeholder="Digite seu usuário"
                            disabled={loading}
                        />
                    </div>

                    <div className="studium-form-group">
                        <label htmlFor="password" className="studium-form-label login-form-label">
                            Senha
                        </label>
                        <div className="studium-pwd-field">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="studium-form-input"
                                placeholder="Digite sua senha"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="studium-pwd-toggle"
                                disabled={loading}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary btn-login"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        onClick={handleEsqueciSenha}
                        className="btn-link"
                    >
                        Esqueci minha senha
                    </button>

                    <div className="divider-container">
                        <div className="divider"></div>
                        <div className="divider-text">
                            <span>ou</span>
                        </div>
                        <div className="divider"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCadastrar}
                        className="btn-secondary btn-login"
                    >
                        Criar uma conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
