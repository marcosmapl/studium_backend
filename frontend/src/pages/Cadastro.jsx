import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { createUsuario } from '../services/api';
// Usar ícones do componente local
import { Eye, EyeOff } from '../components/Icons';

const Cadastro = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [unidadesFederativas, setUnidadesFederativas] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [grupoBasicoId, setGrupoBasicoId] = useState(null);
    const [situacaoAtivoId, setSituacaoAtivoId] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        username: '',
        password: '',
        confirmaSenha: '',
        email: '',
        dataNascimento: '',
        generoUsuarioId: '',
        unidadeFederativaId: '',
        cidadeId: ''
    });

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    const carregarDadosIniciais = async () => {
        try {
            const [generosResponse, unidadesResponse, gruposResponse, situacoesResponse] = await Promise.all([
                api.get('/generoUsuario'),
                api.get('/unidadeFederativa'),
                api.get('/grupoUsuario'),
                api.get('/situacaoUsuario')
            ]);

            console.log('Gêneros:', generosResponse.data);
            console.log('Unidades Federativas:', unidadesResponse.data);
            console.log('Grupos:', gruposResponse.data);
            console.log('Situações:', situacoesResponse.data);

            if (generosResponse.data) {
                setGeneros(generosResponse.data);
            }

            if (unidadesResponse.data) {
                setUnidadesFederativas(unidadesResponse.data);
            }

            // Buscar automaticamente o grupo "Básico"
            if (gruposResponse.data) {
                const grupoBasico = gruposResponse.data.find(g => g.descricao === 'Básico');
                if (grupoBasico) {
                    setGrupoBasicoId(grupoBasico.id);
                    console.log('Grupo Básico ID:', grupoBasico.id);
                } else {
                    console.error('Grupo "Básico" não encontrado');
                    toast.error('Erro: Grupo de usuário "Básico" não configurado');
                }
            }

            // Buscar automaticamente a situação "Ativo"
            if (situacoesResponse.data) {
                const situacaoAtivo = situacoesResponse.data.find(s => s.descricao === 'Ativo');
                if (situacaoAtivo) {
                    setSituacaoAtivoId(situacaoAtivo.id);
                    console.log('Situação Ativo ID:', situacaoAtivo.id);
                } else {
                    console.error('Situação "Ativo" não encontrada');
                    toast.error('Erro: Situação de usuário "Ativo" não configurada');
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            console.error('Detalhes do erro:', error.response);
            toast.error('Erro ao carregar dados do formulário');
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Carrega cidades quando uma UF for selecionada
        if (name === 'unidadeFederativaId' && value) {
            try {
                const response = await api.get(`/cidade/uf/${value}`);
                if (response.data) {
                    setCidades(response.data);
                }
                // Limpa a cidade selecionada ao mudar a UF
                setFormData(prev => ({ ...prev, cidadeId: '' }));
            } catch (error) {
                console.error('Erro ao carregar cidades:', error);
                toast.error('Erro ao carregar cidades');
                setCidades([]);
            }
        }
    };

    const validarFormulario = () => {
        const novosErros = {};

        if (!formData.nome.trim()) {
            novosErros.nome = 'Nome é obrigatório';
        }

        if (!formData.sobrenome.trim()) {
            novosErros.sobrenome = 'Sobrenome é obrigatório';
        }

        if (!formData.username.trim()) {
            novosErros.username = 'Nome de usuário é obrigatório';
        } else if (formData.username.length < 3) {
            novosErros.username = 'Nome de usuário deve ter no mínimo 3 caracteres';
        }

        if (!formData.password) {
            novosErros.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            novosErros.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (!formData.confirmaSenha) {
            novosErros.confirmaSenha = 'Confirmação de senha é obrigatória';
        } else if (formData.password !== formData.confirmaSenha) {
            novosErros.confirmaSenha = 'As senhas não coincidem';
        }

        if (!formData.email.trim()) {
            novosErros.email = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            novosErros.email = 'E-mail inválido';
        }

        if (!formData.generoUsuarioId) {
            novosErros.generoUsuarioId = 'Gênero é obrigatório';
        }

        if (!formData.unidadeFederativaId) {
            novosErros.unidadeFederativaId = 'Estado é obrigatório';
        }

        if (!formData.cidadeId) {
            novosErros.cidadeId = 'Cidade é obrigatória';
        }

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            toast.error('Por favor, corrija os erros no formulário');
            return;
        }

        // Verificar se grupo e situação foram carregados
        if (!grupoBasicoId || !situacaoAtivoId) {
            toast.error('Erro: Configuração do sistema incompleta. Tente novamente.');
            return;
        }

        setLoading(true);

        try {
            // Remove confirmaSenha e unidadeFederativaId antes de enviar
            const { confirmaSenha, unidadeFederativaId, ...dadosParaEnviar } = formData;

            // Converte IDs para inteiros
            dadosParaEnviar.generoUsuarioId = parseInt(dadosParaEnviar.generoUsuarioId);
            dadosParaEnviar.cidadeId = parseInt(dadosParaEnviar.cidadeId);

            // Adiciona grupo "Básico" e situação "Ativo" automaticamente
            dadosParaEnviar.grupoUsuarioId = grupoBasicoId;
            dadosParaEnviar.situacaoUsuarioId = situacaoAtivoId;

            // Remove dataNascimento se estiver vazio, ou converte para ISO-8601 DateTime
            if (!dadosParaEnviar.dataNascimento || dadosParaEnviar.dataNascimento.trim() === '') {
                delete dadosParaEnviar.dataNascimento;
            } else {
                // Converte YYYY-MM-DD para ISO-8601 DateTime (adiciona T00:00:00.000Z)
                dadosParaEnviar.dataNascimento = new Date(dadosParaEnviar.dataNascimento + 'T00:00:00.000Z').toISOString();
            }

            await createUsuario(dadosParaEnviar);

            toast.success('Cadastro realizado com sucesso!');

            // Redirecionar para login com o nome de usuário preenchido
            navigate('/', { state: { username: formData.username } });
        } catch (error) {
            console.error('Erro ao cadastrar:', error);

            if (error.response?.status === 409) {
                // Conflito - usuário ou email já existe
                const mensagem = error.response.data?.message || 'Usuário ou e-mail já cadastrado';
                toast.error(mensagem);

                // Marcar campos que podem ter conflito
                if (mensagem.toLowerCase().includes('usuário') || mensagem.toLowerCase().includes('username')) {
                    setErrors(prev => ({ ...prev, username: 'Nome de usuário já existe' }));
                }
                if (mensagem.toLowerCase().includes('email') || mensagem.toLowerCase().includes('e-mail')) {
                    setErrors(prev => ({ ...prev, email: 'E-mail já cadastrado' }));
                }
            } else if (error.response?.status === 400) {
                // Dados inválidos
                const mensagem = error.response.data?.message || 'Dados inválidos';
                toast.error(mensagem);

                // Tentar identificar campos com erro
                const camposErro = error.response.data?.errors || {};
                setErrors(prev => ({ ...prev, ...camposErro }));
            } else {
                toast.error('Erro ao realizar cadastro. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getInputClassName = (fieldName) => {
        const baseClass = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition";
        const errorClass = errors[fieldName] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500";
        return `${baseClass} ${errorClass}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4" style={{ backgroundColor: '#343c4b' }}>
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">Criar Conta</h1>
                    <p className="text-gray-600">Preencha os dados para se cadastrar no Studium</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                Nome *
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                value={formData.nome}
                                onChange={handleChange}
                                className={getInputClassName('nome')}
                                placeholder="ex: João"
                                disabled={loading}
                            />
                            {errors.nome && (
                                <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                            )}
                        </div>

                        {/* Sobrenome */}
                        <div>
                            <label htmlFor="sobrenome" className="block text-sm font-medium text-gray-700 mb-2">
                                Sobrenome *
                            </label>
                            <input
                                id="sobrenome"
                                name="sobrenome"
                                type="text"
                                value={formData.sobrenome}
                                onChange={handleChange}
                                className={getInputClassName('sobrenome')}
                                placeholder="ex: Silva"
                                disabled={loading}
                            />
                            {errors.sobrenome && (
                                <p className="text-red-500 text-xs mt-1">{errors.sobrenome}</p>
                            )}
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome de Usuário *
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className={getInputClassName('username')}
                            placeholder="ex: joao.silva"
                            disabled={loading}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* E-mail */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={getInputClassName('email')}
                            placeholder="seu.email@exemplo.com"
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                        <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-2">
                            Data de Nascimento (opcional)
                        </label>
                        <input
                            id="dataNascimento"
                            name="dataNascimento"
                            type="date"
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            className={getInputClassName('dataNascimento')}
                            disabled={loading}
                        />
                    </div>

                    {/* Gênero */}
                    <div>
                        <label htmlFor="generoUsuarioId" className="block text-sm font-medium text-gray-700 mb-2">
                            Gênero *
                        </label>
                        <select
                            id="generoUsuarioId"
                            name="generoUsuarioId"
                            value={formData.generoUsuarioId}
                            onChange={handleChange}
                            className={getInputClassName('generoUsuarioId')}
                            disabled={loading}
                        >
                            <option value="">Selecione seu gênero</option>
                            {generos.map(genero => (
                                <option key={genero.id} value={genero.id}>
                                    {genero.descricao}
                                </option>
                            ))}
                        </select>
                        {errors.generoUsuarioId && (
                            <p className="text-red-500 text-xs mt-1">{errors.generoUsuarioId}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha *
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showSenha ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={getInputClassName('password')}
                                    placeholder="Mínimo 6 caracteres"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenha(!showSenha)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={loading}
                                >
                                    {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label htmlFor="confirmaSenha" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Senha *
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmaSenha"
                                    name="confirmaSenha"
                                    type={showConfirmaSenha ? 'text' : 'password'}
                                    value={formData.confirmaSenha}
                                    onChange={handleChange}
                                    className={getInputClassName('confirmaSenha')}
                                    placeholder="Repita a senha"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmaSenha(!showConfirmaSenha)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    disabled={loading}
                                >
                                    {showConfirmaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmaSenha && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmaSenha}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Unidade Federativa */}
                        <div>
                            <label htmlFor="unidadeFederativaId" className="block text-sm font-medium text-gray-700 mb-2">
                                Estado (UF) *
                            </label>
                            <select
                                id="unidadeFederativaId"
                                name="unidadeFederativaId"
                                value={formData.unidadeFederativaId}
                                onChange={handleChange}
                                className={getInputClassName('unidadeFederativaId')}
                                disabled={loading}
                            >
                                <option value="">Selecione um estado</option>
                                {unidadesFederativas.map(uf => (
                                    <option key={uf.id} value={uf.id}>
                                        {uf.sigla} - {uf.descricao}
                                    </option>
                                ))}
                            </select>
                            {errors.unidadeFederativaId && (
                                <p className="text-red-500 text-xs mt-1">{errors.unidadeFederativaId}</p>
                            )}
                        </div>

                        {/* Cidade */}
                        <div>
                            <label htmlFor="cidadeId" className="block text-sm font-medium text-gray-700 mb-2">
                                Cidade *
                            </label>
                            <select
                                id="cidadeId"
                                name="cidadeId"
                                value={formData.cidadeId}
                                onChange={handleChange}
                                className={getInputClassName('cidadeId')}
                                disabled={loading || !formData.unidadeFederativaId}
                            >
                                <option value="">
                                    {formData.unidadeFederativaId
                                        ? 'Selecione uma cidade'
                                        : 'Primeiro selecione um estado'}
                                </option>
                                {cidades.map(cidade => (
                                    <option key={cidade.id} value={cidade.id}>
                                        {cidade.descricao}
                                    </option>
                                ))}
                            </select>
                            {errors.cidadeId && (
                                <p className="text-red-500 text-xs mt-1">{errors.cidadeId}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
