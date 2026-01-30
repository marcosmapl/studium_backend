import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usuarioService, cidadeService } from '../services/api';
import { Eye, EyeOff } from '../components/Icons';
import { useCadastroData } from '../hooks/useCadastroData';
import './AuthShared.css';
import './Cadastro.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = {
    minLength: 8,
    uppercase: /[A-Z]/,
    digit: /\d/,
};
const requiredFields = [
    'nome',
    'sobrenome',
    'username',
    'password',
    'confirmaSenha',
    'email',
    'generoUsuarioId',
    'unidadeFederativaId',
    'cidadeId',
];

const Cadastro = () => {
    const navigate = useNavigate();

    // Hook customizado para carregar dados iniciais
    const { loading: loadingData, generos, unidadesFederativas, grupoGratuitoId, situacaoAtivoId } = useCadastroData();

    const [loading, setLoading] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
    const [cidades, setCidades] = useState([]);
    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [availability, setAvailability] = useState({ username: null, email: null });
    const [checkingAvailability, setCheckingAvailability] = useState({ username: false, email: false });

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

    const getFieldError = (fieldName, value, currentData = formData) => {
        switch (fieldName) {
            case 'nome':
                return value.trim() ? '' : 'Nome é obrigatório';
            case 'sobrenome':
                return value.trim() ? '' : 'Sobrenome é obrigatório';
            case 'username': {
                const trimmed = value.trim();
                if (!trimmed) return 'Nome de usuário é obrigatório';
                if (trimmed.length < 3) return 'Nome de usuário deve ter no mínimo 3 caracteres';
                if (availability.username && availability.username.available === false) {
                    return availability.username.reason || 'Nome de usuário já cadastrado';
                }
                return '';
            }
            case 'email': {
                const trimmed = value.trim();
                if (!trimmed) return 'E-mail é obrigatório';
                if (!emailRegex.test(trimmed)) return 'E-mail inválido';
                if (availability.email && availability.email.available === false) {
                    return availability.email.reason || 'E-mail já cadastrado';
                }
                return '';
            }
            case 'password': {
                if (!value) return 'Senha é obrigatória';
                if (value.length < passwordRules.minLength) {
                    return 'Senha deve ter no mínimo 8 caracteres';
                }
                if (!passwordRules.uppercase.test(value) || !passwordRules.digit.test(value)) {
                    return 'Senha deve ter ao menos 1 letra maiúscula e 1 número';
                }
                return '';
            }
            case 'confirmaSenha': {
                if (!value) return 'Confirmação de senha é obrigatória';
                if (currentData.password !== value) return 'As senhas não coincidem';
                return '';
            }
            case 'generoUsuarioId':
                return currentData.generoUsuarioId ? '' : 'Gênero é obrigatório';
            case 'unidadeFederativaId':
                return currentData.unidadeFederativaId ? '' : 'Estado é obrigatório';
            case 'cidadeId':
                return currentData.cidadeId ? '' : 'Cidade é obrigatória';
            default:
                return '';
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };

        if (name === 'username') {
            setAvailability(prev => ({ ...prev, username: null }));
        }

        if (name === 'email') {
            setAvailability(prev => ({ ...prev, email: null }));
        }

        if (name === 'unidadeFederativaId') {
            updatedData = { ...updatedData, cidadeId: '' };
        }

        setFormData(updatedData);

        if (touchedFields[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: getFieldError(name, value, updatedData)
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (name === 'password' && touchedFields.confirmaSenha) {
            setErrors(prev => ({
                ...prev,
                confirmaSenha: getFieldError('confirmaSenha', updatedData.confirmaSenha, updatedData)
            }));
        }

        if (name === 'unidadeFederativaId' && touchedFields.cidadeId) {
            setErrors(prev => ({
                ...prev,
                cidadeId: getFieldError('cidadeId', updatedData.cidadeId, updatedData)
            }));
        }

        if (name === 'unidadeFederativaId') {
            if (!value) {
                setCidades([]);
                return;
            }

            try {
                const cidadesResponse = await cidadeService.getByUF(value);
                setCidades(cidadesResponse || []);
            } catch (error) {
                toast.error('Erro ao carregar cidades');
                setCidades([]);
            }
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: getFieldError(name, formData[name], formData)
        }));

        if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                confirmaSenha: getFieldError('confirmaSenha', formData.confirmaSenha, formData)
            }));
        }
    };

    const validarFormulario = () => {
        const novosErros = requiredFields.reduce((acc, field) => {
            acc[field] = getFieldError(field, formData[field], formData);
            return acc;
        }, {});

        setErrors(prev => ({ ...prev, ...novosErros }));
        setTouchedFields(prev => ({
            ...prev,
            ...requiredFields.reduce((marks, field) => {
                marks[field] = true;
                return marks;
            }, {})
        }));

        return Object.values(novosErros).every(message => !message);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            toast.error('Por favor, corrija os erros no formulário');
            return;
        }

        const usernameTrimmed = formData.username.trim();
        const emailTrimmed = formData.email.trim();
        const emailHasValidFormat = emailRegex.test(emailTrimmed);

        const availabilityPending =
            checkingAvailability.username ||
            checkingAvailability.email ||
            (usernameTrimmed.length >= 3 && availability.username === null) ||
            (emailHasValidFormat && availability.email === null);

        const availabilityInvalid =
            (availability.username && availability.username.available === false) ||
            (availability.email && availability.email.available === false);

        if (availabilityPending) {
            toast.info('Aguarde a validação de disponibilidade antes de continuar.');
            return;
        }

        if (availabilityInvalid) {
            toast.error('Corrija os campos destacados antes de prosseguir.');
            return;
        }

        // Verificar se grupo e situação foram carregados
        if (!grupoGratuitoId || !situacaoAtivoId) {
            toast.error('Erro: Configuração do sistema incompleta. Tente novamente.');
            return;
        }

        setLoading(true);

        try {
            const dadosSanitizados = {
                ...formData,
                nome: formData.nome.trim(),
                sobrenome: formData.sobrenome.trim(),
                username: usernameTrimmed,
                email: emailTrimmed.toLowerCase(),
            };

            // Remove confirmaSenha e unidadeFederativaId antes de enviar
            const { confirmaSenha, unidadeFederativaId, ...dadosParaEnviar } = dadosSanitizados;

            // Converte cidadeId para inteiro e mantém generoUsuario como enum string
            dadosParaEnviar.cidadeId = parseInt(dadosParaEnviar.cidadeId, 10);
            // generoUsuarioId já vem como string do enum (FEMININO, MASCULINO, OUTRO)
            dadosParaEnviar.generoUsuario = dadosParaEnviar.generoUsuarioId;
            delete dadosParaEnviar.generoUsuarioId;

            // Adiciona grupo "Gratuito" e situação "Ativo" automaticamente
            dadosParaEnviar.grupoUsuarioId = parseInt(grupoGratuitoId, 10);
            dadosParaEnviar.situacaoUsuario = situacaoAtivoId;

            // Remove dataNascimento se estiver vazio, ou converte para ISO-8601 DateTime
            if (!dadosParaEnviar.dataNascimento || dadosParaEnviar.dataNascimento.trim() === '') {
                delete dadosParaEnviar.dataNascimento;
            } else {
                // Converte YYYY-MM-DD para ISO-8601 DateTime (adiciona T00:00:00.000Z)
                dadosParaEnviar.dataNascimento = new Date(dadosParaEnviar.dataNascimento + 'T00:00:00.000Z').toISOString();
            }

            await usuarioService.create(dadosParaEnviar);

            toast.success('Cadastro realizado com sucesso!');

            // Redirecionar para login com o nome de usuário preenchido
            navigate('/', { state: { username: formData.username } });
        } catch (error) {
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
        return errors[fieldName] ? "studium-form-input error" : "studium-form-input";
    };

    // Desabilita o formulário enquanto carrega dados iniciais
    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim();
    const usernameNeedsCheck = trimmedUsername.length >= 3;
    const emailHasValidFormat = emailRegex.test(trimmedEmail);

    const availabilityPending =
        checkingAvailability.username ||
        checkingAvailability.email ||
        (usernameNeedsCheck && availability.username === null) ||
        (emailHasValidFormat && availability.email === null);

    const availabilityInvalid =
        (availability.username && availability.username.available === false) ||
        (availability.email && availability.email.available === false);

    const hasFieldErrors = requiredFields.some(field => Boolean(getFieldError(field, formData[field], formData)));

    const isFormDisabled = loadingData || loading;
    const isSubmitDisabled = isFormDisabled || availabilityPending || availabilityInvalid || hasFieldErrors;

    const shouldShowUsernameChecking = checkingAvailability.username && usernameNeedsCheck;
    const shouldShowEmailChecking = checkingAvailability.email && emailHasValidFormat;
    const shouldShowUsernameSuccess =
        !checkingAvailability.username &&
        usernameNeedsCheck &&
        availability.username &&
        availability.username.available &&
        touchedFields.username &&
        !errors.username;
    const shouldShowEmailSuccess =
        !checkingAvailability.email &&
        emailHasValidFormat &&
        availability.email &&
        availability.email.available &&
        touchedFields.email &&
        !errors.email;

    useEffect(() => {
        const usernameAtual = formData.username.trim();

        if (!usernameAtual || usernameAtual.length < 3) {
            setCheckingAvailability(prev => ({ ...prev, username: false }));
            if (!usernameAtual) {
                setAvailability(prev => ({ ...prev, username: null }));
            }
            return;
        }

        let ativo = true;
        setCheckingAvailability(prev => ({ ...prev, username: true }));

        const timer = setTimeout(async () => {
            try {
                const resultado = await usuarioService.checkAvailability({ username: usernameAtual });
                if (!ativo) return;

                const info = resultado.username || { available: true };
                setAvailability(prev => ({ ...prev, username: info }));
            } catch (error) {
                if (!ativo) return;
                toast.error('Não foi possível validar o nome de usuário.');
                setAvailability(prev => ({
                    ...prev,
                    username: { available: false, reason: 'Não foi possível validar o nome de usuário' }
                }));
            } finally {
                if (ativo) {
                    setCheckingAvailability(prev => ({ ...prev, username: false }));
                }
            }
        }, 500);

        return () => {
            ativo = false;
            clearTimeout(timer);
        };
    }, [formData.username]);

    useEffect(() => {
        const emailAtual = formData.email.trim().toLowerCase();

        if (!emailAtual || !emailRegex.test(emailAtual)) {
            setCheckingAvailability(prev => ({ ...prev, email: false }));
            if (!emailAtual) {
                setAvailability(prev => ({ ...prev, email: null }));
            }
            return;
        }

        let ativo = true;
        setCheckingAvailability(prev => ({ ...prev, email: true }));

        const timer = setTimeout(async () => {
            try {
                const resultado = await usuarioService.checkAvailability({ email: emailAtual });
                if (!ativo) return;

                const info = resultado.email || { available: true };
                setAvailability(prev => ({ ...prev, email: info }));
            } catch (error) {
                if (!ativo) return;
                toast.error('Não foi possível validar o e-mail.');
                setAvailability(prev => ({
                    ...prev,
                    email: { available: false, reason: 'Não foi possível validar o e-mail' }
                }));
            } finally {
                if (ativo) {
                    setCheckingAvailability(prev => ({ ...prev, email: false }));
                }
            }
        }, 500);

        return () => {
            ativo = false;
            clearTimeout(timer);
        };
    }, [formData.email]);

    useEffect(() => {
        if (touchedFields.username) {
            const mensagem = getFieldError('username', formData.username, formData);
            setErrors(prev => (prev.username === mensagem ? prev : { ...prev, username: mensagem }));
        }
    }, [availability.username, touchedFields.username, formData.username]);

    useEffect(() => {
        if (touchedFields.email) {
            const mensagem = getFieldError('email', formData.email, formData);
            setErrors(prev => (prev.email === mensagem ? prev : { ...prev, email: mensagem }));
        }
    }, [availability.email, touchedFields.email, formData.email]);

    return (
        <div className="studium-container">
            <div className="studium-main-card auth-card">
                <div className="studium-form-header">
                    <h1 className="studium-form-title">Criar Conta</h1>
                    <p className="studium-form-subtitle">Preencha os dados para se cadastrar no Studium</p>
                </div>

                {loadingData ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: '#6b7280' }}>Carregando formulário...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="studium-form">
                        <div className="form-layout">
                            <aside className="form-sidebar">
                                <span className="form-sidebar-badge">Instruções para Cadastro</span>
                                <h2 className="form-sidebar-title">Pronto para fazer parte do Studium?</h2>
                                <p className="form-sidebar-description">
                                    Em poucos passos você cria sua conta e libera acesso aos recursos de planejamento de estudos, comunidades e trilhas personalizadas.
                                </p>
                                <ul className="form-sidebar-list">
                                    <li>Comece preenchendo seus <strong>dados pessoais</strong>.</li>
                                    <li>Informe também os <strong>dados para acesso</strong>.</li>
                                    <li>Por fim, nos diga <strong>sua localidade</strong>.</li>
                                </ul>
                                <div className="form-sidebar-note">
                                    <span className="note-dot" aria-hidden="true"></span>
                                    <p>
                                        A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula e um número"
                                    </p>
                                </div>
                            </aside>

                            <div className="form-content">
                                <section className="form-section">
                                    <header className="section-head">
                                        <div>
                                            <h2 className="section-title">Dados pessoais</h2>
                                            <p className="section-subtitle">Comece nos contando quem você é.</p>
                                        </div>
                                        <span className="section-step">01</span>
                                    </header>

                                    <div className="form-grid form-grid-two">
                                        <div className="studium-form-group">
                                            <label htmlFor="nome" className="studium-form-label">Nome *</label>
                                            <input
                                                id="nome"
                                                name="nome"
                                                type="text"
                                                value={formData.nome}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('nome')}
                                                placeholder="ex: João"
                                                disabled={isFormDisabled}
                                            />
                                            {errors.nome && <span className="error-message">{errors.nome}</span>}
                                        </div>

                                        <div className="studium-form-group">
                                            <label htmlFor="sobrenome" className="studium-form-label">Sobrenome *</label>
                                            <input
                                                id="sobrenome"
                                                name="sobrenome"
                                                type="text"
                                                value={formData.sobrenome}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('sobrenome')}
                                                placeholder="ex: Silva"
                                                disabled={isFormDisabled}
                                            />
                                            {errors.sobrenome && <span className="error-message">{errors.sobrenome}</span>}
                                        </div>
                                    </div>

                                    <div className="form-grid form-grid-two">
                                        <div className="studium-form-group">
                                            <label htmlFor="dataNascimento" className="studium-form-label">Data de Nascimento</label>
                                            <input
                                                id="dataNascimento"
                                                name="dataNascimento"
                                                type="date"
                                                value={formData.dataNascimento}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('dataNascimento')}
                                                disabled={isFormDisabled}
                                            />
                                        </div>

                                        <div className="studium-form-group">
                                            <label htmlFor="generoUsuarioId" className="studium-form-label">Gênero *</label>
                                            <select
                                                id="generoUsuarioId"
                                                name="generoUsuarioId"
                                                value={formData.generoUsuarioId}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('generoUsuarioId')}
                                                disabled={isFormDisabled}
                                            >
                                                <option key="placeholder" value="">Selecione seu gênero</option>
                                                {generos.map(genero => (
                                                    <option key={genero.id} value={genero.id}>{genero.descricao}</option>
                                                ))}
                                            </select>
                                            {errors.generoUsuarioId && <span className="error-message">{errors.generoUsuarioId}</span>}
                                        </div>
                                    </div>
                                </section>

                                <section className="form-section">
                                    <header className="section-head">
                                        <div>
                                            <h2 className="section-title">Dados de acesso</h2>
                                            <p className="section-subtitle">Defina como você fará login na plataforma.</p>
                                        </div>
                                        <span className="section-step">02</span>
                                    </header>

                                    <div className="form-grid form-grid-two">
                                        <div className="studium-form-group">
                                            <label htmlFor="username" className="studium-form-label">Nome de Usuário *</label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('username')}
                                                placeholder="ex: joao.silva"
                                                disabled={isFormDisabled}
                                            />
                                            {shouldShowUsernameChecking && (
                                                <span className="field-feedback checking">Verificando disponibilidade...</span>
                                            )}
                                            {shouldShowUsernameSuccess && (
                                                <span className="field-feedback success">Nome de usuário disponível</span>
                                            )}
                                            {errors.username && <span className="error-message">{errors.username}</span>}
                                        </div>

                                        <div className="studium-form-group">
                                            <label htmlFor="email" className="studium-form-label">E-mail *</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('email')}
                                                placeholder="seu.email@exemplo.com"
                                                disabled={isFormDisabled}
                                            />
                                            {shouldShowEmailChecking && (
                                                <span className="field-feedback checking">Verificando disponibilidade...</span>
                                            )}
                                            {shouldShowEmailSuccess && (
                                                <span className="field-feedback success">E-mail disponível</span>
                                            )}
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="form-grid form-grid-two form-grid-tight">
                                        <div className="studium-form-group">
                                            <label htmlFor="password" className="studium-form-label">Senha *</label>
                                            <div className="studium-pwd-field">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showSenha ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={getInputClassName('password')}
                                                    placeholder="Crie uma senha segura"
                                                    disabled={isFormDisabled}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSenha(!showSenha)}
                                                    className="studium-pwd-toggle"
                                                    disabled={isFormDisabled}
                                                >
                                                    {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.password && <span className="error-message">{errors.password}</span>}
                                        </div>

                                        <div className="studium-form-group">
                                            <label htmlFor="confirmaSenha" className="studium-form-label">Confirmar Senha *</label>
                                            <div className="studium-pwd-field">
                                                <input
                                                    id="confirmaSenha"
                                                    name="confirmaSenha"
                                                    type={showConfirmaSenha ? 'text' : 'password'}
                                                    value={formData.confirmaSenha}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={getInputClassName('confirmaSenha')}
                                                    placeholder="Repita a senha"
                                                    disabled={isFormDisabled}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmaSenha(!showConfirmaSenha)}
                                                    className="studium-pwd-toggle"
                                                    disabled={isFormDisabled}
                                                >
                                                    {showConfirmaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.confirmaSenha && <span className="error-message">{errors.confirmaSenha}</span>}
                                        </div>
                                    </div>
                                </section>

                                <section className="form-section">
                                    <header className="section-head">
                                        <div>
                                            <h2 className="section-title">Localização</h2>
                                            <p className="section-subtitle">Finalize escolhendo o lugar de onde você estuda.</p>
                                        </div>
                                        <span className="section-step">03</span>
                                    </header>

                                    <div className="form-grid form-grid-two">
                                        <div className="studium-form-group">
                                            <label htmlFor="unidadeFederativaId" className="studium-form-label">Estado *</label>
                                            <select
                                                id="unidadeFederativaId"
                                                name="unidadeFederativaId"
                                                value={formData.unidadeFederativaId}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('unidadeFederativaId')}
                                                disabled={isFormDisabled}
                                            >
                                                <option key="placeholder" value="">Selecione um estado</option>
                                                {unidadesFederativas.map(uf => (
                                                    <option key={uf.id} value={uf.id}>
                                                        {uf.sigla} - {uf.descricao}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.unidadeFederativaId && <span className="error-message">{errors.unidadeFederativaId}</span>}
                                        </div>

                                        <div className="studium-form-group">
                                            <label htmlFor="cidadeId" className="studium-form-label">Cidade *</label>
                                            <select
                                                id="cidadeId"
                                                name="cidadeId"
                                                value={formData.cidadeId}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={getInputClassName('cidadeId')}
                                                disabled={isFormDisabled || !formData.unidadeFederativaId}
                                            >
                                                <option key="placeholder" value="">
                                                    {formData.unidadeFederativaId ? 'Selecione uma cidade' : 'Primeiro selecione um estado'}
                                                </option>
                                                {cidades.map(cidade => (
                                                    <option key={cidade.id} value={cidade.id}>{cidade.descricao}</option>
                                                ))}
                                            </select>
                                            {errors.cidadeId && <span className="error-message">{errors.cidadeId}</span>}
                                        </div>
                                    </div>
                                </section>

                                <div className="form-actions">
                                    <span className="form-disclaimer">Ao prosseguir você concorda com os termos de uso e política de privacidade.</span>
                                    <button
                                        type="submit"
                                        disabled={isSubmitDisabled}
                                        className="btn-primary btn-cadastrar"
                                    >
                                        {loading ? 'Cadastrando...' : 'Criar conta agora'}
                                    </button>
                                </div>
                            </div>
                        </div>
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
