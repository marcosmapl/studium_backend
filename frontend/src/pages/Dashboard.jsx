import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBullseye, faChartBar, faFire, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { usePlanoEstudoContext } from '../contexts/PlanoEstudoContext';
import { sessaoEstudoService, revisaoService, topicoService } from '../services/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
    const { planoSelecionado, plano } = usePlanoEstudoContext();

    const [sessoes, setSessoes] = useState([]);
    const [revisoes, setRevisoes] = useState([]);
    const [topicos, setTopicos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega dados quando plano muda
    useEffect(() => {
        const carregarDados = async () => {
            if (!planoSelecionado) {
                setSessoes([]);
                setRevisoes([]);
                setTopicos([]);
                return;
            }

            setLoading(true);

            try {
                const [sessoes, revisoes, topicos] = await Promise.all([
                    sessaoEstudoService.getByPlanoId(planoSelecionado),
                    revisaoService.getByPlanoId(planoSelecionado),
                    topicoService.getByPlanoId(planoSelecionado)
                ]);

                setSessoes(sessoes || []);
                setRevisoes(revisoes || []);
                setTopicos(topicos || []);

            } catch (error) {

                toast.error('Erro ao carregar dados do dashboard');
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [planoSelecionado]);

    // Calcula métricas
    const metricas = useMemo(() => {
        // Tempo total de estudo (em minutos)
        const tempoSessoes = sessoes.reduce((acc, sessao) => acc + (sessao.tempoEstudo || 0), 0);
        const tempoRevisoes = revisoes.reduce((acc, revisao) => {
            if (revisao.dataRealizacao) {
                return acc + (revisao.tempoRevisao || 0);
            }
            return acc;
        }, 0);
        const tempoTotalMinutos = tempoSessoes + tempoRevisoes;
        const tempoTotalHoras = Math.floor(tempoTotalMinutos / 60);
        const tempoTotalMinutosRestantes = tempoTotalMinutos % 60;

        // Desempenho geral
        const acertosSessoes = sessoes.reduce((acc, sessao) => acc + (sessao.questoesAcertos || 0), 0);
        const errosSessoes = sessoes.reduce((acc, sessao) => acc + (sessao.questoesErros || 0), 0);
        const acertosRevisoes = revisoes
            .filter(r => r.dataRealizacao)
            .reduce((acc, revisao) => acc + (revisao.questoesAcertos || 0), 0);
        const errosRevisoes = revisoes
            .filter(r => r.dataRealizacao)
            .reduce((acc, revisao) => acc + (revisao.questoesErros || 0), 0);

        const totalAcertos = acertosSessoes + acertosRevisoes;
        const totalErros = errosSessoes + errosRevisoes;
        const totalQuestoes = totalAcertos + totalErros;
        const percentualDesempenho = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

        // Progresso no edital
        const topicosConcluidos = topicos.filter(t => t.concluido).length;
        const totalTopicos = topicos.length;
        const percentualProgresso = totalTopicos > 0 ? Math.round((topicosConcluidos / totalTopicos) * 100) : 0;

        // Constância nos estudos
        let diasEstudados = 0;
        let totalDias = 0;
        let sequenciaAtual = 0;
        let maiorSequencia = 0;
        let diasComEstudo = new Set();

        if (plano?.dataCriacao) {
            const dataCriacao = new Date(plano.dataCriacao);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            dataCriacao.setHours(0, 0, 0, 0);

            // Calcula total de dias desde a criação
            totalDias = Math.floor((hoje - dataCriacao) / (1000 * 60 * 60 * 24)) + 1;

            // Identifica dias com estudo (sessões ou revisões)
            sessoes.forEach(sessao => {
                const dataSessao = new Date(sessao.dataInicio);
                dataSessao.setHours(0, 0, 0, 0);
                const dataKey = dataSessao.toISOString().split('T')[0];
                diasComEstudo.add(dataKey);
            });

            revisoes.forEach(revisao => {
                if (revisao.dataRealizacao) {
                    const dataRevisao = new Date(revisao.dataRealizacao);
                    dataRevisao.setHours(0, 0, 0, 0);
                    const dataKey = dataRevisao.toISOString().split('T')[0];
                    diasComEstudo.add(dataKey);
                }
            });

            diasEstudados = diasComEstudo.size;

            // Calcula sequências
            let sequenciaTemp = 0;
            for (let i = 0; i < totalDias; i++) {
                const dataAtual = new Date(dataCriacao);
                dataAtual.setDate(dataAtual.getDate() + i);
                const dataKey = dataAtual.toISOString().split('T')[0];

                if (diasComEstudo.has(dataKey)) {
                    sequenciaTemp++;
                    if (sequenciaTemp > maiorSequencia) {
                        maiorSequencia = sequenciaTemp;
                    }
                } else {
                    sequenciaTemp = 0;
                }
            }

            // Sequência atual (últimos dias consecutivos até hoje)
            sequenciaAtual = 0;
            for (let i = 0; i < totalDias; i++) {
                const dataAtual = new Date(hoje);
                dataAtual.setDate(dataAtual.getDate() - i);
                const dataKey = dataAtual.toISOString().split('T')[0];

                if (diasComEstudo.has(dataKey)) {
                    sequenciaAtual++;
                } else {
                    break;
                }
            }
        }

        const percentualConstancia = totalDias > 0 ? Math.round((diasEstudados / totalDias) * 100) : 0;
        const diasFalhados = totalDias - diasEstudados;

        // Gera array dos últimos 30 dias para o calendário
        const calendarioDias = [];
        const hoje = new Date();
        for (let i = 29; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(data.getDate() - i);
            data.setHours(0, 0, 0, 0);
            const dataKey = data.toISOString().split('T')[0];
            calendarioDias.push({
                data: data,
                dataKey: dataKey,
                estudou: diasComEstudo.has(dataKey)
            });
        }

        return {
            tempoTotalHoras,
            tempoTotalMinutosRestantes,
            totalAcertos,
            totalErros,
            percentualDesempenho,
            topicosConcluidos,
            totalTopicos,
            totalTopicosPendentes: totalTopicos - topicosConcluidos,
            percentualProgresso,
            diasEstudados,
            diasFalhados,
            percentualConstancia,
            sequenciaAtual,
            maiorSequencia,
            calendarioDias
        };
    }, [sessoes, revisoes, topicos, plano]);

    // Formata tempo para exibição
    const formatarTempo = () => {
        if (metricas.tempoTotalHoras === 0 && metricas.tempoTotalMinutosRestantes === 0) {
            return '0h';
        }
        if (metricas.tempoTotalMinutosRestantes === 0) {
            return `${metricas.tempoTotalHoras}h`;
        }
        if (metricas.tempoTotalHoras === 0) {
            return `${metricas.tempoTotalMinutosRestantes}min`;
        }
        return `${metricas.tempoTotalHoras}h ${metricas.tempoTotalMinutosRestantes}min`;
    };

    if (!planoSelecionado) {
        return (
            <Layout>
                <div className="studium-container">
                    <div className="studium-page-header">
                        <h2 className="studium-page-title">Dashboard</h2>
                    </div>
                    <div className="planos-vazio">
                        <p>Selecione um plano de estudo para visualizar as estatísticas.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="studium-container">
                <div className="studium-page-header">
                    <h2 className="studium-page-title">Dashboard</h2>
                </div>

                {loading ? (
                    <div className="loading-message">Carregando dados...</div>
                ) : (
                    <>
                        {/* Seção de Métricas */}
                        <div className="studium-section-row dashboard-kpi-section">
                            {/* Tempo de Estudo */}
                            <div className="studium-card-base dashboard-kpi-card">
                                <div className="studium-card-header">
                                    <FontAwesomeIcon icon={faClock} className="studium-card-icon" />
                                    <h3 className="studium-card-title">Tempo de Estudo</h3>
                                </div>
                                <div className="studium-section-row dashboard-kpi-card-content">
                                    <div className="dashboard-kpi-details">
                                    </div>
                                    <p className="studium-card-value">{formatarTempo()}</p>
                                </div>
                            </div>

                            {/* Desempenho */}
                            <div className="studium-card-base dashboard-kpi-card">
                                <div className="studium-card-header">
                                    <FontAwesomeIcon icon={faBullseye} className="studium-card-icon" />
                                    <h3 className="studium-card-title">Desempenho</h3>
                                </div>
                                <div className="studium-section-row dashboard-kpi-card-content">
                                    <div className="dashboard-kpi-details">
                                        <p className="text-md font-bold text-success ml-3">{metricas.totalAcertos} Acertos</p>
                                        <p className="text-md font-bold text-error ml-3">{metricas.totalErros} Erros</p>
                                    </div>
                                    <p className="studium-card-value">{metricas.percentualDesempenho}%</p>
                                </div>
                            </div>

                            {/* Progresso no Edital */}
                            <div className="studium-card-base dashboard-kpi-card">
                                <div className="studium-card-header">
                                    <FontAwesomeIcon icon={faChartBar} className="studium-card-icon" />
                                    <h3 className="studium-card-title">Progresso no Edital</h3>
                                </div>
                                <div className="studium-section-row dashboard-kpi-card-content">
                                    <div className="dashboard-kpi-details">
                                        <p className="text-md font-bold text-success ml-3">{metricas.topicosConcluidos} Concluídos</p>
                                        <p className="text-md font-bold text-error ml-3">{metricas.totalTopicosPendentes} Pendentes</p>
                                    </div>
                                    <p className="studium-card-value">{metricas.percentualProgresso}%</p>
                                </div>
                            </div>

                            {/* Constância nos Estudos */}
                            <div className="studium-card-base dashboard-kpi-card">
                                <div className="studium-card-header">
                                    <FontAwesomeIcon icon={faFire} className="studium-card-icon" />
                                    <h3 className="studium-card-title">Constância nos Estudos</h3>
                                </div>
                                <div className="studium-section-row dashboard-kpi-card-content">
                                    <div className="dashboard-kpi-details">
                                        <p className="text-md font-bold text-success ml-3">{metricas.diasEstudados} Estudados</p>
                                        <p className="text-md font-bold text-error ml-3">{metricas.diasFalhados} Falhados</p>
                                    </div>
                                    <p className="studium-card-value">{metricas.percentualConstancia}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Constância nos Estudos - Calendário */}
                        <div className="studium-section-row dashboard-consistency-section">
                            <div className="studium-card-base dashboard-kpi-card">
                                <div className="studium-card-header">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="studium-card-icon" />
                                    <h3 className="studium-card-title">Últimos 30 Dias</h3>
                                </div>

                                <div className="studium-section-column">
                                    <div className="dashboard-kpi-details">
                                        <p className="studium-card-subtitle">
                                            {metricas.sequenciaAtual > 0 ? (
                                                <>
                                                    Você está há
                                                    <span className="font-bold text-success ml-1">{metricas.sequenciaAtual} {metricas.sequenciaAtual === 1 ? 'dia' : 'dias'}</span>
                                                    {' '}sem falhar!
                                                </>
                                            ) : (
                                                'Comece uma nova sequência de estudos!'
                                            )}
                                            {metricas.maiorSequencia > 0 && (
                                                <>
                                                    {' '}Seu recorde é de
                                                    <span className="font-bold text-warning ml-1">{metricas.maiorSequencia} {metricas.maiorSequencia === 1 ? 'dia' : 'dias'}</span>.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    {/* Grid de 30 dias */}
                                    <div className="dashboard-days-grid">
                                        {metricas.calendarioDias.map((dia, index) => {
                                            const dataFormatada = dia.data.toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit'
                                            });

                                            return (
                                                <div
                                                    key={index}
                                                    className="dashboard-day-item"
                                                    title={`${dataFormatada}: ${dia.estudou ? 'Estudou' : 'Não estudou'}`}
                                                >
                                                    {dia.estudou ? (
                                                        <svg className="dashboard-icon-success" fill="currentColor" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" className="dashboard-icon-bg" />
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="dashboard-icon-error" fill="currentColor" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" className="dashboard-icon-bg" />
                                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
