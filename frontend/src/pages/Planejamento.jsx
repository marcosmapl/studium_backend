import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PlanejamentoForm from '../components/PlanejamentoForm';
import SessaoEstudoForm from '../components/SessaoEstudoForm';
import BoardViewSemanal from '../components/BoardViewSemanal';
import BoardViewMensal from '../components/BoardViewMensal';
import { usePlanoEstudoContext } from '../contexts/PlanoEstudoContext';
import { useAuth } from '../contexts/AuthContext';
import { diasSemanaOptions, formatarPeriodoSemana, formatarPeriodoMensal, getDiasDoMes } from '../utils/utils';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarWeek,
    faCalendarAlt,
    faPlus,
    faEdit,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Planejamento.css';

// Constantes
const VISUALIZACAO_SEMANAL = 'semanal';
const VISUALIZACAO_MENSAL = 'mensal';
const isDevelopment = import.meta.env.DEV;

const Planejamento = () => {
    const { usuario } = useAuth();
    const location = useLocation();

    // Hook customizado para carregar planos de estudo
    const { planoSelecionado } = usePlanoEstudoContext();

    const [visualizacao, setVisualizacao] = useState(VISUALIZACAO_SEMANAL);
    const [semanaAtual, setSemanaAtual] = useState(new Date());
    const [mesAtual, setMesAtual] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [disciplinasPlano, setDisciplinasPlano] = useState([]);
    const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
    const [blocosEstudo, setBlocosEstudo] = useState([]);
    const [loadingBlocos, setLoadingBlocos] = useState(false);
    const [tempoEstudadoPorBloco, setTempoEstudadoPorBloco] = useState({});

    // Estados para sessão de estudo
    const [isSessaoFormOpen, setIsSessaoFormOpen] = useState(false);
    const [blocoSelecionado, setBlocoSelecionado] = useState(null);

    // Carrega disciplinas quando plano selecionado mudar
    useEffect(() => {
        let isMounted = true; // Para evitar race conditions

        const carregarDisciplinas = async () => {
            if (!planoSelecionado) {
                setDisciplinasPlano([]);
                return;
            }

            setLoadingDisciplinas(true);
            try {
                const response = await api.get(`/disciplina/plano/${planoSelecionado}`);
                if (isMounted) {
                    setDisciplinasPlano(response.data || []);
                }
            } catch (error) {
                if (isMounted) {
                    setDisciplinasPlano([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingDisciplinas(false);
                }
            }
        };

        carregarDisciplinas();

        return () => {
            isMounted = false; // Cleanup
        };
    }, [planoSelecionado]);

    // Carrega blocos de estudo quando plano selecionado mudar
    useEffect(() => {
        let isMounted = true; // Para evitar race conditions

        const carregarBlocos = async () => {
            if (!planoSelecionado) {
                setBlocosEstudo([]);
                setLoadingBlocos(false);
                return;
            }

            // Limpa blocos anteriores imediatamente ao trocar de plano
            setBlocosEstudo([]);
            setLoadingBlocos(true);

            try {

                const response = await api.get(`/blocoEstudo/plano/${planoSelecionado}`);
                if (isMounted) {
                    setBlocosEstudo(response.data || []);
                }
            } catch (error) {
                if (isMounted) {
                    toast.error('Erro ao carregar blocos de estudo');
                    setBlocosEstudo([]);
                }
            } finally {
                if (isMounted) {
                    setLoadingBlocos(false);
                }
            }
        };

        carregarBlocos();

        return () => {
            isMounted = false; // Cleanup
        };
    }, [planoSelecionado]);

    // Carrega tempo estudado de cada bloco
    useEffect(() => {
        const carregarTempoEstudado = async () => {
            if (!blocosEstudo || blocosEstudo.length === 0) {
                setTempoEstudadoPorBloco({});
                return;
            }

            try {
                // Busca sessões de todos os blocos em paralelo
                const promises = blocosEstudo.map(bloco =>
                    api.get(`/sessaoEstudo/blocoEstudo/${bloco.id}`)
                        .then(response => ({
                            blocoId: bloco.id,
                            sessoes: response.data || []
                        }))
                        .catch(() => ({ blocoId: bloco.id, sessoes: [] }))
                );

                const resultados = await Promise.all(promises);

                // Calcula tempo estudado total por bloco
                const tempoMap = {};
                resultados.forEach(({ blocoId, sessoes }) => {
                    const tempoTotal = sessoes.reduce((sum, sessao) =>
                        sum + Number(sessao.tempoEstudo || 0), 0
                    );
                    tempoMap[blocoId] = tempoTotal;
                });

                setTempoEstudadoPorBloco(tempoMap);
            } catch (error) {
                setTempoEstudadoPorBloco({});
            }
        };

        carregarTempoEstudado();
    }, [blocosEstudo]);

    // Memoização de blocos por dia da semana (com tempo estudado)
    const blocosPorDia = useMemo(() => {
        const mapa = {};
        diasSemanaOptions.forEach(dia => {
            mapa[dia.id] = blocosEstudo
                .filter(bloco => bloco.diaSemana === dia.id)
                .sort((a, b) => a.ordem - b.ordem)
                .map(bloco => ({
                    ...bloco,
                    tempoEstudado: tempoEstudadoPorBloco[bloco.id] || 0
                }));
        });
        return mapa;
    }, [blocosEstudo, tempoEstudadoPorBloco]);

    // Memoização de horas totais por dia
    const horasPorDia = useMemo(() => {
        const mapa = {};
        Object.keys(blocosPorDia).forEach(diaSemana => {
            mapa[diaSemana] = blocosPorDia[diaSemana].reduce(
                (total, bloco) => total + Number(bloco.totalHorasPlanejadas),
                0
            );
        });
        return mapa;
    }, [blocosPorDia]);

    // Memoização de disciplinas por ID
    const disciplinasMap = useMemo(() => {
        const map = new Map();
        disciplinasPlano.forEach(d => map.set(d.id, d));
        return map;
    }, [disciplinasPlano]);

    // Handler para abrir formulário de planejamento
    const handleAbrirFormulario = useCallback(() => {
        if (!planoSelecionado) {
            toast.error('Selecione um plano de estudo primeiro!');
            return;
        }

        if (loadingDisciplinas || loadingBlocos) {
            toast.warning('Aguarde o carregamento dos dados...');
            return;
        }

        if (!disciplinasPlano || disciplinasPlano.length === 0) {
            toast.error('Este plano não possui disciplinas cadastradas.');
            return;
        }

        setIsFormOpen(true);
    }, [planoSelecionado, loadingDisciplinas, loadingBlocos, disciplinasPlano]);

    // Handler para submissão do formulário
    const handleFormSubmit = useCallback(async (data) => {
        try {
            const { blocos, dadosPlano, disciplinasAtualizadas } = data;

            // Valida blocos antes de enviar
            const blocosInvalidos = blocos.filter(b =>
                b.diaSemana === undefined ||
                b.diaSemana === null ||
                !b.ordem ||
                !b.totalHorasPlanejadas ||
                !b.disciplinaId
            );

            if (blocosInvalidos.length > 0) {
                toast.error('Erro na geração dos blocos. Por favor, tente novamente.');
                return;
            }

            // 1. Atualizar PlanoEstudo com dias ativos e horas
            await api.put(`/planoEstudo/${planoSelecionado}`, dadosPlano);

            // 2. Atualizar horasSemanais das disciplinas
            await Promise.all(
                disciplinasAtualizadas.map(disciplina =>
                    api.put(`/disciplina/${disciplina.id}`, {
                        horasSemanais: disciplina.horasSemanais,
                        selecionada: disciplina.selecionada
                    })
                )
            );

            // 3. Remover blocos antigos do plano (em paralelo)
            await Promise.allSettled(
                blocosEstudo.map(blocoAntigo =>
                    api.delete(`/blocoEstudo/${blocoAntigo.id}`)
                )
            );

            // 4. Criar novos blocos
            await Promise.all(
                blocos.map(bloco =>
                    api.post('/blocoEstudo', {
                        diaSemana: bloco.diaSemana,
                        ordem: bloco.ordem,
                        totalHorasPlanejadas: bloco.totalHorasPlanejadas,
                        planoEstudoId: planoSelecionado,
                        disciplinaId: bloco.disciplinaId
                    })
                )
            );

            // 5. Recarregar dados
            const [blocosResponse, disciplinasResponse] = await Promise.all([
                api.get(`/blocoEstudo/plano/${planoSelecionado}`),
                api.get(`/disciplina/plano/${planoSelecionado}`)
            ]);

            setBlocosEstudo(blocosResponse.data || []);
            setDisciplinasPlano(disciplinasResponse.data || []);

            toast.success('Planejamento salvo com sucesso!');
            setIsFormOpen(false);
        } catch (error) {
            toast.error('Erro ao salvar planejamento: ' + (error.response?.data?.message || error.message));
        }
    }, [planoSelecionado, blocosEstudo]);

    // Handlers de navegação
    const handleAnterior = useCallback(() => {
        if (visualizacao === VISUALIZACAO_SEMANAL) {
            setSemanaAtual(prev => {
                const nova = new Date(prev);
                nova.setDate(nova.getDate() - 7);
                return nova;
            });
        } else {
            setMesAtual(prev => {
                const novo = new Date(prev);
                novo.setMonth(novo.getMonth() - 1);
                return novo;
            });
        }
    }, [visualizacao]);

    const handleProximo = useCallback(() => {
        if (visualizacao === VISUALIZACAO_SEMANAL) {
            setSemanaAtual(prev => {
                const nova = new Date(prev);
                nova.setDate(nova.getDate() + 7);
                return nova;
            });
        } else {
            setMesAtual(prev => {
                const novo = new Date(prev);
                novo.setMonth(novo.getMonth() + 1);
                return novo;
            });
        }
    }, [visualizacao]);

    // Memoização dos dias do mês
    const diasDoMes = useMemo(() => getDiasDoMes(mesAtual), [mesAtual]);

    // Handler para abrir formulário de sessão de estudo
    const handleBlocoClick = useCallback((bloco) => {
        if (bloco.concluido) {
            toast.info('Este bloco já foi concluído');
            return;
        }

        setBlocoSelecionado(bloco);
        setIsSessaoFormOpen(true);
    }, []);

    // Handler para sucesso no registro de sessão
    const handleSessaoSuccess = useCallback(async () => {
        // Recarregar blocos de estudo
        try {
            const response = await api.get(`/blocoEstudo/plano/${planoSelecionado}`);
            setBlocosEstudo(response.data || []);
        } catch (error) {
            toast.error('Erro ao salvar planejamento: ' + (error.response?.data?.message || error.message));
        }
    }, [planoSelecionado]);

    return (
        <Layout>
            <div className="studium-container">
                {/* Cabeçalho */}
                <div className="studium-page-header planejamento-header">
                    <div className="planejamento-header-left">
                        <h2 className="studium-page-title">Planejamento de Estudos</h2>
                    </div>
                    <div className="planejamento-header-right">
                        {blocosEstudo && blocosEstudo.length > 0 ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleAbrirFormulario}
                                disabled={!planoSelecionado}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                                Ajustar Planejamento
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={handleAbrirFormulario}
                                disabled={!planoSelecionado}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Novo Planejamento
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
                                {visualizacao === VISUALIZACAO_SEMANAL
                                    ? formatarPeriodoSemana(semanaAtual)
                                    : formatarPeriodoMensal(mesAtual)}
                            </span>
                            <button className="btn btn-icon" onClick={handleProximo}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        <div className="visualizacao-toggle">
                            <button
                                className={`btn btn-toggle ${visualizacao === VISUALIZACAO_SEMANAL ? 'active' : ''}`}
                                onClick={() => setVisualizacao(VISUALIZACAO_SEMANAL)}
                            >
                                <FontAwesomeIcon icon={faCalendarWeek} />
                                Semanal
                            </button>
                            <button
                                className={`btn btn-toggle ${visualizacao === VISUALIZACAO_MENSAL ? 'active' : ''}`}
                                onClick={() => setVisualizacao(VISUALIZACAO_MENSAL)}
                            >
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Mensal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Área de Visualização */}
                <div className="planejamento-conteudo">
                    {loadingBlocos ? (
                        <div className="loading-container">
                            <p>Carregando blocos de estudo...</p>
                        </div>
                    ) : (
                        <>
                            {visualizacao === VISUALIZACAO_SEMANAL && (
                                <BoardViewSemanal
                                    blocosPorDia={blocosPorDia}
                                    horasPorDia={horasPorDia}
                                    disciplinasMap={disciplinasMap}
                                    onBlocoClick={handleBlocoClick}
                                />
                            )}
                            {visualizacao === VISUALIZACAO_MENSAL && (
                                <BoardViewMensal
                                    diasDoMes={diasDoMes}
                                    blocosPorDia={blocosPorDia}
                                    horasPorDia={horasPorDia}
                                    disciplinasMap={disciplinasMap}
                                    onBlocoClick={handleBlocoClick}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Modal de Formulário de Planejamento */}
                <PlanejamentoForm
                    planoEstudoId={planoSelecionado}
                    disciplinas={disciplinasPlano}
                    blocosAtuais={blocosEstudo}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />

                {/* Modal de Formulário de Sessão de Estudo */}
                <SessaoEstudoForm
                    isOpen={isSessaoFormOpen}
                    onClose={() => {
                        setIsSessaoFormOpen(false);
                        setBlocoSelecionado(null);
                    }}
                    blocoEstudo={blocoSelecionado}
                    disciplina={blocoSelecionado ? disciplinasMap.get(blocoSelecionado.disciplinaId) : null}
                    planoEstudoId={planoSelecionado}
                    onSuccess={handleSessaoSuccess}
                />
            </div>
        </Layout>
    );
};

export default Planejamento;
