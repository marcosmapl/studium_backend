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
        <div className="login-container">
            {/* Lado Esquerdo - Logo */}
            <div className="login-left">
                <div className="login-logo-wrapper">
                    <div className="login-logo-content">
                        <img src="studium-logo.png" alt="Studium Logo" />
                    <h1 className="login-logo-title">STUDIUM</h1>
                    <p className="login-logo-subtitle">Seu sistema de gestão de estudos</p>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="login-right">
                <div className="login-form-wrapper">
                    <h2 className="login-welcome">Bem-vindo de volta</h2>
                    <p className="login-instruction">Entre com suas credenciais para acessar sua conta</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-form-group">
                            <label htmlFor="usuario" className="login-form-label">
                                Usuário
                            </label>
                            <input
                                id="usuario"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-form-input"
                                placeholder="Digite seu usuário"
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        <div className="login-form-group">
                            <label htmlFor="password" className="login-form-label">
                                Senha
                            </label>
                            <div className="login-pwd-field">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-form-input"
                                    placeholder="Digite sua senha"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="login-pwd-toggle"
                                    disabled={loading}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleEsqueciSenha}
                            className="login-forgot-link"
                        >
                            Esqueci minha senha
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login-submit-btn"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="login-register-section">
                        <p className="login-register-text">
                            Não é cadastrado?{' '}
                            <button
                                type="button"
                                onClick={handleCadastrar}
                                className="login-register-link"
                            >
                                Faça seu cadastro aqui!
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
