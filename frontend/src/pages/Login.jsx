import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || '');
    const [password, setPassword] = useState('');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">Studium</h1>
                    <p className="text-gray-600">Sistema de Gestão de Estudos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                            Usuário
                        </label>
                        <input
                            id="usuario"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Digite seu usuário"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Digite sua senha"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    <button
                        type="button"
                        onClick={handleEsqueciSenha}
                        className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                    >
                        Esqueci minha senha
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">ou</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCadastrar}
                        className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                    >
                        Criar uma conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
