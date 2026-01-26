import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PlanejamentoForm from '../components/PlanejamentoForm';
import { usePlanoEstudoData } from '../hooks/usePlanoEstudoData';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarWeek,
    faCalendarAlt,
    faCalendar,
    faPlus,
    faEdit,
    faClock,
    faBook,
    faVideo,
    faQuestionCircle,
    faSync,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Planejamento.css';

// Dados fictícios
const temPlanejamento = true;

const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const sessoesEstudoMock = {
    0: [], // Domingo
    1: [ // Segunda
        {
            id: 1,
            disciplina: 'Direito Constitucional',
            topico: 'Direitos Fundamentais',
            categoria: 'Teoria',
            tempoSugerido: 2.0,
            cor: '#3b82f6'
        },
        {
            id: 2,
            disciplina: 'Português',
            topico: 'Interpretação de Texto',
            categoria: 'Questões',
            tempoSugerido: 1.5,
            cor: '#10b981'
        }
    ],
    2: [ // Terça
        {
            id: 3,
            disciplina: 'Direito Administrativo',
            topico: 'Atos Administrativos',
            categoria: 'Videoaula',
            tempoSugerido: 1.5,
            cor: '#f59e0b'
        },
        {
            id: 4,
            disciplina: 'Matemática',
            topico: 'Estatística Básica',
            categoria: 'Teoria',
            tempoSugerido: 2.0,
            cor: '#ef4444'
        }
    ],
    3: [ // Quarta
        {
            id: 5,
            disciplina: 'Direito Constitucional',
            topico: 'Direitos Fundamentais',
            categoria: 'Revisão',
            tempoSugerido: 1.0,
            cor: '#3b82f6'
        },
        {
            id: 6,
            disciplina: 'Informática',
            topico: 'Redes de Computadores',
            categoria: 'Leitura',
            tempoSugerido: 1.5,
            cor: '#8b5cf6'
        }
    ],
    4: [ // Quinta
        {
            id: 7,
            disciplina: 'Português',
            topico: 'Sintaxe',
            categoria: 'Teoria',
            tempoSugerido: 2.0,
            cor: '#10b981'
        },
        {
            id: 8,
            disciplina: 'Direito Penal',
            topico: 'Crimes contra a Administração',
            categoria: 'Questões',
            tempoSugerido: 1.5,
            cor: '#ec4899'
        }
    ],
    5: [ // Sexta
        {
            id: 9,
            disciplina: 'Direito Administrativo',
            topico: 'Atos Administrativos',
            categoria: 'Revisão',
            tempoSugerido: 1.0,
            cor: '#f59e0b'
        },
        {
            id: 10,
            disciplina: 'Raciocínio Lógico',
            topico: 'Proposições Lógicas',
            categoria: 'Questões',
            tempoSugerido: 2.0,
            cor: '#06b6d4'
        }
    ],
    6: [ // Sábado
        {
            id: 11,
            disciplina: 'Direito Constitucional',
            topico: 'Organização do Estado',
            categoria: 'Teoria',
            tempoSugerido: 2.5,
            cor: '#3b82f6'
        },
        {
            id: 12,
            disciplina: 'Português',
            topico: 'Redação Oficial',
            categoria: 'Leitura',
            tempoSugerido: 1.5,
            cor: '#10b981'
        }
    ]
};

const iconesCategoria = {
    'Teoria': faBook,
    'Leitura': faBook,
    'Videoaula': faVideo,
    'Questões': faQuestionCircle,
    'Revisão': faSync
};

const Planejamento = () => {
    // Contexto de autenticação
    const { usuario } = useAuth();
    const location = useLocation();

    // Hook customizado para carregar planos de estudo
    const { loading: loadingPlanos, planosEstudo } = usePlanoEstudoData(usuario?.id);

    const [visualizacao, setVisualizacao] = useState('semanal'); // semanal, mensal, anual
    const [semanaAtual, setSemanaAtual] = useState(new Date());
    const [mesAtual, setMesAtual] = useState(new Date());
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [planejamentoAtual, setPlanejamentoAtual] = useState(null);
    const [disciplinasPlano, setDisciplinasPlano] = useState([]);
    const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);

    // Inicializa plano selecionado quando planos carregarem
    useEffect(() => {
        if (planosEstudo && planosEstudo.length > 0) {
            // Se veio de navegação com planoId, usa ele, senão usa o primeiro
            const planoIdFromNav = location.state?.planoId;
            const planoInicial = planoIdFromNav
                ? planosEstudo.find(p => p.id === planoIdFromNav)?.id || planosEstudo[0].id
                : planosEstudo[0].id;
            setPlanoSelecionado(planoInicial);
        }
    }, [planosEstudo, location.state]);

    // Carrega disciplinas quando plano selecionado mudar
    useEffect(() => {
        const carregarDisciplinas = async () => {
            if (!planoSelecionado) {
                setDisciplinasPlano([]);
                return;
            }

            setLoadingDisciplinas(true);
            try {
                const response = await api.get(`/disciplina/plano/${planoSelecionado}`);
                setDisciplinasPlano(response.data || []);
            } catch (error) {
                console.error('Erro ao carregar disciplinas:', error);
                setDisciplinasPlano([]);
                // Não exibir alert para não interromper a experiência do usuário
            } finally {
                setLoadingDisciplinas(false);
            }
        };

        carregarDisciplinas();
    }, [planoSelecionado]);

    const handleCriarPlanejamento = () => {
        if (!planoSelecionado) {
            alert('Selecione um plano de estudo primeiro!');
            return;
        }

        if (loadingDisciplinas) {
            alert('Aguarde o carregamento das disciplinas...');
            return;
        }

        if (!disciplinasPlano || disciplinasPlano.length === 0) {
            alert('Este plano não possui disciplinas cadastradas. Cadastre disciplinas antes de criar um planejamento.');
            return;
        }

        setPlanejamentoAtual(null);
        setIsFormOpen(true);
    };

    const handleAjustarPlanejamento = () => {
        if (!planoSelecionado) {
            alert('Selecione um plano de estudo primeiro!');
            return;
        }

        if (loadingDisciplinas) {
            alert('Aguarde o carregamento das disciplinas...');
            return;
        }

        if (!disciplinasPlano || disciplinasPlano.length === 0) {
            alert('Este plano não possui disciplinas cadastradas. Cadastre disciplinas antes de ajustar o planejamento.');
            return;
        }

        // TODO: Carregar planejamento existente da API
        setPlanejamentoAtual(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (planejamentoData) => {
        try {
            console.log('Dados do planejamento:', planejamentoData);
            // TODO: Enviar para API
            // if (planejamentoData.id) {
            //     await api.put(`/planejamento/${planejamentoData.id}`, planejamentoData);
            // } else {
            //     await api.post('/planejamento', { ...planejamentoData, planoEstudoId: planoSelecionado });
            // }
            alert('Planejamento salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar planejamento:', error);
            alert('Erro ao salvar planejamento');
        }
    };

    const handleAnterior = () => {
        if (visualizacao === 'semanal') {
            const novaData = new Date(semanaAtual);
            novaData.setDate(novaData.getDate() - 7);
            setSemanaAtual(novaData);
        } else if (visualizacao === 'mensal') {
            const novaData = new Date(mesAtual);
            novaData.setMonth(novaData.getMonth() - 1);
            setMesAtual(novaData);
        }
    };

    const handleProximo = () => {
        if (visualizacao === 'semanal') {
            const novaData = new Date(semanaAtual);
            novaData.setDate(novaData.getDate() + 7);
            setSemanaAtual(novaData);
        } else if (visualizacao === 'mensal') {
            const novaData = new Date(mesAtual);
            novaData.setMonth(novaData.getMonth() + 1);
            setMesAtual(novaData);
        }
    };

    const formatarPeriodoSemana = () => {
        const inicio = new Date(semanaAtual);
        inicio.setDate(inicio.getDate() - inicio.getDay());

        const fim = new Date(inicio);
        fim.setDate(fim.getDate() + 6);

        return `${inicio.getDate()}/${inicio.getMonth() + 1}/${fim.getFullYear()} - ${fim.getDate()}/${fim.getMonth() + 1}/${fim.getFullYear()}`;
    };

    const formatarPeriodoMensal = () => {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${meses[mesAtual.getMonth()]} ${mesAtual.getFullYear()}`;
    };

    const getDiasDoMes = () => {
        const ano = mesAtual.getFullYear();
        const mes = mesAtual.getMonth();

        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);

        const diasAnteriores = primeiroDia.getDay();
        const totalDias = ultimoDia.getDate();

        const dias = [];

        // Dias do mês anterior
        const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
        for (let i = diasAnteriores - 1; i >= 0; i--) {
            dias.push({
                dia: ultimoDiaMesAnterior - i,
                mesAtual: false,
                data: new Date(ano, mes - 1, ultimoDiaMesAnterior - i)
            });
        }

        // Dias do mês atual
        for (let i = 1; i <= totalDias; i++) {
            dias.push({
                dia: i,
                mesAtual: true,
                data: new Date(ano, mes, i)
            });
        }

        // Dias do próximo mês
        const diasRestantes = 42 - dias.length; // 6 semanas x 7 dias
        for (let i = 1; i <= diasRestantes; i++) {
            dias.push({
                dia: i,
                mesAtual: false,
                data: new Date(ano, mes + 1, i)
            });
        }

        return dias;
    };

    const getSessoesDoDia = (data) => {
        const diaSemana = data.getDay();
        return sessoesEstudoMock[diaSemana] || [];
    };

    const calcularTotalHoras = (diaSemana) => {
        const sessoes = sessoesEstudoMock[diaSemana] || [];
        return sessoes.reduce((total, sessao) => total + sessao.tempoSugerido, 0);
    };

    const renderSessaoCard = (sessao) => (
        <div key={sessao.id} className="sessao-card" style={{ borderLeftColor: sessao.cor }}>
            <div className="sessao-card-header">
                <div className="sessao-categoria">
                    <FontAwesomeIcon icon={iconesCategoria[sessao.categoria] || faBook} />
                    <span>{sessao.categoria}</span>
                </div>
                <div className="sessao-tempo">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{sessao.tempoSugerido}h</span>
                </div>
            </div>
            <h4 className="sessao-disciplina">{sessao.disciplina}</h4>
            <p className="sessao-topico">{sessao.topico}</p>
        </div>
    );

    const renderSessaoCardMensal = (sessao) => (
        <div key={sessao.id} className="sessao-card-mensal" style={{ borderLeftColor: sessao.cor }}>
            <div className="sessao-mensal-info">
                <FontAwesomeIcon icon={iconesCategoria[sessao.categoria] || faBook} className="sessao-mensal-icon" />
                <span className="sessao-mensal-disciplina">{sessao.disciplina}</span>
            </div>
            <span className="sessao-mensal-tempo">{sessao.tempoSugerido}h</span>
        </div>
    );

    const renderVisualizacaoSemanal = () => (
        <div className="calendario-semanal">
            {diasSemana.map((dia, index) => {
                const sessoes = sessoesEstudoMock[index] || [];
                const totalHoras = calcularTotalHoras(index);

                return (
                    <div key={index} className="dia-coluna">
                        <div className="dia-header">
                            <h3 className="dia-nome">{dia}</h3>
                            {totalHoras > 0 && (
                                <span className="dia-total-horas">
                                    <FontAwesomeIcon icon={faClock} />
                                    {totalHoras}h
                                </span>
                            )}
                        </div>
                        <div className="dia-sessoes">
                            {sessoes.length > 0 ? (
                                sessoes.map(sessao => renderSessaoCard(sessao))
                            ) : (
                                <div className="dia-vazio">
                                    <p>Nenhuma sessão planejada</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderVisualizacaoMensal = () => {
        const dias = getDiasDoMes();

        return (
            <div className="calendario-mensal">
                {/* Cabeçalhos dos dias da semana */}
                <div className="calendario-mensal-header">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
                        <div key={index} className="calendario-mensal-dia-semana">
                            {dia}
                        </div>
                    ))}
                </div>

                {/* Grid de dias */}
                <div className="calendario-mensal-grid">
                    {dias.map((diaInfo, index) => {
                        const sessoes = getSessoesDoDia(diaInfo.data);
                        const totalHoras = sessoes.reduce((total, sessao) => total + sessao.tempoSugerido, 0);

                        return (
                            <div
                                key={index}
                                className={`calendario-mensal-dia ${diaInfo.mesAtual ? 'mes-atual' : 'mes-outro'
                                    } ${sessoes.length > 0 ? 'com-sessoes' : ''
                                    }`}
                            >
                                <div className="dia-mensal-header">
                                    <span className="dia-mensal-numero">{diaInfo.dia}</span>
                                    {totalHoras > 0 && (
                                        <span className="dia-mensal-total">
                                            <FontAwesomeIcon icon={faClock} />
                                            {totalHoras}h
                                        </span>
                                    )}
                                </div>
                                <div className="dia-mensal-sessoes">
                                    {sessoes.map(sessao => renderSessaoCardMensal(sessao))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className="studium-container">
                {/* Cabeçalho */}
                <div className="studium-page-header planejamento-header">
                    <div className="planejamento-header-left">
                        <h2 className="studium-page-title">Planejamento de Estudos</h2>
                        <div className="plano-selector">
                            <label htmlFor="planoSelect" className="plano-selector-label">
                                Plano de Estudo:
                            </label>
                            {loadingPlanos ? (
                                <span>Carregando planos...</span>
                            ) : (
                                <select
                                    id="planoSelect"
                                    value={planoSelecionado || ''}
                                    onChange={(e) => setPlanoSelecionado(Number(e.target.value))}
                                    className="plano-select"
                                    disabled={!planosEstudo || planosEstudo.length === 0}
                                >
                                    {planosEstudo && planosEstudo.length > 0 ? (
                                        planosEstudo.map(plano => (
                                            <option key={plano.id} value={plano.id}>
                                                {plano.titulo}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Nenhum plano disponível</option>
                                    )}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="planejamento-header-right">
                        {temPlanejamento ? (
                            <button className="btn btn-primary" onClick={handleAjustarPlanejamento}>
                                <FontAwesomeIcon icon={faEdit} />
                                Ajustar Planejamento
                            </button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleCriarPlanejamento}>
                                <FontAwesomeIcon icon={faPlus} />
                                Criar Novo Planejamento
                            </button>
                        )}
                    </div>
                </div>

                {/* Controles de Visualização */}
                <div className="planejamento-controles-wrapper">
                    <div className="studium-card-base planejamento-controles">
                        <div className="periodo-navegacao">
                            <button className="btn btn-icon" onClick={handleAnterior}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <span className="periodo-texto">
                                {visualizacao === 'semanal' ? formatarPeriodoSemana() : formatarPeriodoMensal()}
                            </span>
                            <button className="btn btn-icon" onClick={handleProximo}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        <div className="visualizacao-toggle">
                            <button
                                className={`btn btn-toggle ${visualizacao === 'semanal' ? 'active' : ''}`}
                                onClick={() => setVisualizacao('semanal')}
                            >
                                <FontAwesomeIcon icon={faCalendarWeek} />
                                Semanal
                            </button>
                            <button
                                className={`btn btn-toggle ${visualizacao === 'mensal' ? 'active' : ''}`}
                                onClick={() => setVisualizacao('mensal')}
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Mensal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Área de Visualização */}
                <div className="planejamento-conteudo">
                    {visualizacao === 'semanal' && renderVisualizacaoSemanal()}
                    {visualizacao === 'mensal' && renderVisualizacaoMensal()}
                </div>

                {/* Modal de Formulário */}
                <PlanejamentoForm
                    planejamento={planejamentoAtual}
                    disciplinas={disciplinasPlano}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </Layout>
    );
};

export default Planejamento;
