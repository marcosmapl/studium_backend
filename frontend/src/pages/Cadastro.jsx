import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUsuario, getCidadesByUF } from '../services/api';
import { Eye, EyeOff } from '../components/Icons';
import { useCadastroData } from '../hooks/useCadastroData';
import './Cadastro.css';

const Cadastro = () => {
    const navigate = useNavigate();

    // Hook customizado para carregar dados iniciais
    const { loading: loadingData, generos, unidadesFederativas, grupoBasicoId, situacaoAtivoId } = useCadastroData();

    const [loading, setLoading] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
    const [cidades, setCidades] = useState([]);
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
                const response = await getCidadesByUF(value);
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
        return errors[fieldName] ? "form-input error" : "form-input";
    };

    // Desabilita o formulário enquanto carrega dados iniciais
    const isFormDisabled = loadingData || loading;

    return (
        <div className="cadastro-container">
            <div className="cadastro-card">
                <div className="cadastro-header">
                    <h1 className="cadastro-title">Criar Conta</h1>
                    <p className="cadastro-subtitle">Preencha os dados para se cadastrar no Studium</p>
                </div>

                {loadingData ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: '#6b7280' }}>Carregando formulário...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="cadastro-form">
                        <div className="form-grid">
                            {/* Nome */}
                            <div className="form-group">
                                <label htmlFor="nome" className="form-label">
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
                                    disabled={isFormDisabled}
                                />
                                {errors.nome && (
                                    <span className="error-message">{errors.nome}</span>
                                )}
                            </div>

                            {/* Sobrenome */}
                            <div className="form-group">
                                <label htmlFor="sobrenome" className="form-label">
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
                                    disabled={isFormDisabled}
                                />
                                {errors.sobrenome && (
                                    <span className="error-message">{errors.sobrenome}</span>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
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
                                disabled={isFormDisabled}
                            />
                            {errors.username && (
                                <span className="error-message">{errors.username}</span>
                            )}
                        </div>

                        {/* E-mail */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
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
                                disabled={isFormDisabled}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email}</span>
                            )}
                        </div>

                        {/* Data de Nascimento */}
                        <div className="form-group">
                            <label htmlFor="dataNascimento" className="form-label">
                                Data de Nascimento (opcional)
                            </label>
                            <input
                                id="dataNascimento"
                                name="dataNascimento"
                                type="date"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                className={getInputClassName('dataNascimento')}
                                disabled={isFormDisabled}
                            />
                        </div>

                        {/* Gênero */}
                        <div className="form-group">
                            <label htmlFor="generoUsuarioId" className="form-label">
                                Gênero *
                            </label>
                            <select
                                id="generoUsuarioId"
                                name="generoUsuarioId"
                                value={formData.generoUsuarioId}
                                onChange={handleChange}
                                className={getInputClassName('generoUsuarioId')}
                                disabled={isFormDisabled}
                            >
                                <option value="">Selecione seu gênero</option>
                                {generos.map(genero => (
                                    <option key={genero.id} value={genero.id}>
                                        {genero.descricao}
                                    </option>
                                ))}
                            </select>
                            {errors.generoUsuarioId && (
                                <span className="error-message">{errors.generoUsuarioId}</span>
                            )}
                        </div>

                        <div className="form-grid">
                            {/* Senha */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Senha *
                                </label>
                                <div className="password-field">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showSenha ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={getInputClassName('password')}
                                        placeholder="Mínimo 6 caracteres"
                                        disabled={isFormDisabled}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSenha(!showSenha)}
                                        className="password-toggle"
                                        disabled={isFormDisabled}
                                    >
                                        {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="error-message">{errors.password}</span>
                                )}
                            </div>

                            {/* Confirmar Senha */}
                            <div className="form-group">
                                <label htmlFor="confirmaSenha" className="form-label">
                                    Confirmar Senha *
                                </label>
                                <div className="password-field">
                                    <input
                                        id="confirmaSenha"
                                        name="confirmaSenha"
                                        type={showConfirmaSenha ? 'text' : 'password'}
                                        value={formData.confirmaSenha}
                                        onChange={handleChange}
                                        className={getInputClassName('confirmaSenha')}
                                        placeholder="Repita a senha"
                                        disabled={isFormDisabled}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmaSenha(!showConfirmaSenha)}
                                        className="password-toggle"
                                        disabled={isFormDisabled}
                                    >
                                        {showConfirmaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmaSenha && (
                                    <span className="error-message">{errors.confirmaSenha}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-grid">
                            {/* Unidade Federativa */}
                            <div className="form-group">
                                <label htmlFor="unidadeFederativaId" className="form-label">
                                    Estado (UF) *
                                </label>
                                <select
                                    id="unidadeFederativaId"
                                    name="unidadeFederativaId"
                                    value={formData.unidadeFederativaId}
                                    onChange={handleChange}
                                    className={getInputClassName('unidadeFederativaId')}
                                    disabled={isFormDisabled}
                                >
                                    <option value="">Selecione um estado</option>
                                    {unidadesFederativas.map(uf => (
                                        <option key={uf.id} value={uf.id}>
                                            {uf.sigla} - {uf.descricao}
                                        </option>
                                    ))}
                                </select>
                                {errors.unidadeFederativaId && (
                                    <span className="error-message">{errors.unidadeFederativaId}</span>
                                )}
                            </div>

                            {/* Cidade */}
                            <div className="form-group">
                                <label htmlFor="cidadeId" className="form-label">
                                    Cidade *
                                </label>
                                <select
                                    id="cidadeId"
                                    name="cidadeId"
                                    value={formData.cidadeId}
                                    onChange={handleChange}
                                    className={getInputClassName('cidadeId')}
                                    disabled={isFormDisabled || !formData.unidadeFederativaId}
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
                                    <span className="error-message">{errors.cidadeId}</span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isFormDisabled}
                            className="btn-submit"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>
                )}

                <div className="cadastro-footer">
                    <p className="cadastro-footer-text">
                        Já tem uma conta?{' '}
                        <Link to="/" className="cadastro-link">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
