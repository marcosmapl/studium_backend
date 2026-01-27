import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PlanejamentoForm from '../components/PlanejamentoForm';
import { usePlanoEstudoData } from '../hooks/usePlanoEstudoData';
import { useAuth } from '../contexts/AuthContext';
import { diasSemanaOptions, horasToHHMM } from '../utils/utils';
import api from '../services/api';
import { toast } from 'react-toastify';
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
    const [disciplinasPlano, setDisciplinasPlano] = useState([]);
    const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
    const [blocosEstudo, setBlocosEstudo] = useState([]);
    const [loadingBlocos, setLoadingBlocos] = useState(false);

    // Log para debug de re-renderizações
    console.log('🎨 COMPONENTE RENDERIZADO - Estado atual:', {
        planoSelecionado,
        totalBlocos: blocosEstudo.length,
        loadingBlocos,
        visualizacao
    });

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
            } finally {
                setLoadingDisciplinas(false);
            }
        };

        carregarDisciplinas();
    }, [planoSelecionado]);

    // Carrega blocos de estudo quando plano selecionado mudar
    useEffect(() => {
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
                console.log('🔄 Carregando blocos para plano:', planoSelecionado);
                const response = await api.get(`/blocoEstudo/plano/${planoSelecionado}`);
                console.log('✅ Blocos carregados:', response.data?.length || 0, 'blocos');
                console.log('📊 IDs dos blocos:', response.data?.map(b => `${b.id}(dia${b.diaSemana})`).join(', '));
                console.log('📊 Dados completos:', response.data);
                setBlocosEstudo(response.data || []);
            } catch (error) {
                console.error('❌ Erro ao carregar blocos de estudo:', error);
                toast.error('Erro ao carregar blocos de estudo');
                setBlocosEstudo([]);
            } finally {
                setLoadingBlocos(false);
            }
        };

        carregarBlocos();
    }, [planoSelecionado]);

    const handleCriarPlanejamento = () => {
        if (!planoSelecionado) {
            toast.error('Selecione um plano de estudo primeiro!');
            return;
        }

        if (loadingDisciplinas || loadingBlocos) {
            toast.warning('Aguarde o carregamento dos dados...');
            return;
        }

        if (!disciplinasPlano || disciplinasPlano.length === 0) {
            toast.error('Este plano não possui disciplinas cadastradas. Cadastre disciplinas antes de criar um planejamento.');
            return;
        }

        setIsFormOpen(true);
    };

    const handleAjustarPlanejamento = () => {
        if (!planoSelecionado) {
            toast.error('Selecione um plano de estudo primeiro!');
            return;
        }

        if (loadingDisciplinas || loadingBlocos) {
            toast.warning('Aguarde o carregamento dos dados...');
            return;
        }

        if (!disciplinasPlano || disciplinasPlano.length === 0) {
            toast.error('Este plano não possui disciplinas cadastradas. Cadastre disciplinas antes de ajustar o planejamento.');
            return;
        }

        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            const { blocos, dadosPlano, disciplinasAtualizadas } = data;

            console.log('📦 Blocos gerados:', blocos);
            console.log('📦 Exemplo do primeiro bloco:', blocos[0]);

            // Valida blocos antes de enviar
            const blocosInvalidos = blocos.filter(b =>
                b.diaSemana === undefined ||
                b.diaSemana === null ||
                !b.ordem ||
                !b.totalHorasPlanejadas ||
                !b.disciplinaId
            );

            if (blocosInvalidos.length > 0) {
                console.error('❌ Blocos inválidos encontrados:', blocosInvalidos);
                toast.error('Erro na geração dos blocos. Por favor, tente novamente.');
                return;
            }

            // 1. Atualizar PlanoEstudo com dias ativos e horas
            console.log('📝 Atualizando PlanoEstudo:', planoSelecionado, dadosPlano);
            await api.put(`/planoEstudo/${planoSelecionado}`, dadosPlano);
            console.log('✅ PlanoEstudo atualizado');

            // 2. Atualizar horasSemanais das disciplinas
            console.log('📝 Atualizando', disciplinasAtualizadas.length, 'disciplinas');
            for (const disciplina of disciplinasAtualizadas) {
                console.log('📝 Atualizando disciplina:', disciplina.id);
                await api.put(`/disciplina/${disciplina.id}`, {
                    horasSemanais: disciplina.horasSemanais,
                    selecionada: disciplina.selecionada
                });
            }
            console.log('✅ Disciplinas atualizadas');

            // 3. Remover blocos antigos do plano
            console.log('🗑️ Removendo', blocosEstudo.length, 'blocos antigos');
            for (const blocoAntigo of blocosEstudo) {
                console.log('🗑️ Removendo bloco:', blocoAntigo.id);
                try {
                    await api.delete(`/blocoEstudo/${blocoAntigo.id}`);
                } catch (error) {
                    console.error('❌ Erro ao deletar bloco', blocoAntigo.id, ':', error.response?.status, error.response?.data);
                    // Continua mesmo se falhar (bloco pode já ter sido deletado)
                }
            }
            console.log('✅ Blocos antigos removidos');

            // 4. Criar novos blocos
            console.log('➕ Criando', blocos.length, 'novos blocos');
            for (const bloco of blocos) {
                const blocoData = {
                    diaSemana: bloco.diaSemana,
                    ordem: bloco.ordem,
                    totalHorasPlanejadas: bloco.totalHorasPlanejadas,
                    planoEstudoId: planoSelecionado,
                    disciplinaId: bloco.disciplinaId
                };
                console.log('📤 Enviando bloco:', blocoData);

                await api.post('/blocoEstudo', blocoData);
            }
            console.log('✅ Novos blocos criados');

            // 5. Recarregar dados
            console.log('🔄 Recarregando dados...');
            const [blocosResponse, disciplinasResponse] = await Promise.all([
                api.get(`/blocoEstudo/plano/${planoSelecionado}`),
                api.get(`/disciplina/plano/${planoSelecionado}`)
            ]);

            setBlocosEstudo(blocosResponse.data || []);
            setDisciplinasPlano(disciplinasResponse.data || []);
            console.log('✅ Dados recarregados');

            toast.success('Planejamento salvo com sucesso!');
            setIsFormOpen(false);
        } catch (error) {
            console.error('❌ Erro ao salvar planejamento:', error);
            console.error('❌ Detalhes do erro:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                method: error.config?.method
            });
            toast.error('Erro ao salvar planejamento: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAnterior = () => {
        if (visualizacao === 'semanal') {
            const novaSemana = new Date(semanaAtual);
            novaSemana.setDate(novaSemana.getDate() - 7);
            setSemanaAtual(novaSemana);
        } else {
            const novoMes = new Date(mesAtual);
            novoMes.setMonth(novoMes.getMonth() - 1);
            setMesAtual(novoMes);
        }
    };

    const handleProximo = () => {
        if (visualizacao === 'semanal') {
            const novaSemana = new Date(semanaAtual);
            novaSemana.setDate(novaSemana.getDate() + 7);
            setSemanaAtual(novaSemana);
        } else {
            const novoMes = new Date(mesAtual);
            novoMes.setMonth(novoMes.getMonth() + 1);
            setMesAtual(novoMes);
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

    const getBlocosDoDia = (diaSemana) => {
        const blocosFiltrados = blocosEstudo
            .filter(bloco => bloco.diaSemana === diaSemana)
            .sort((a, b) => a.ordem - b.ordem);

        if (blocosFiltrados.length > 0) {
            const ids = blocosFiltrados.map(b => b.id).join(',');
            console.log(`📅 Dia ${diaSemana}: ${blocosFiltrados.length} blocos (IDs: ${ids})`);
        }

        return blocosFiltrados;
    };

    const calcularTotalHoras = (diaSemana) => {
        const blocos = getBlocosDoDia(diaSemana);
        return blocos.reduce((total, bloco) => total + Number(bloco.totalHorasPlanejadas), 0);
    };

    const renderBlocoCard = (bloco) => {
        // O backend retorna bloco.disciplina com os dados completos
        const disciplina = bloco.disciplina || disciplinasPlano.find(d => d.id === bloco.disciplinaId);

        return (
            <div key={bloco.id} className="sessao-card" style={{ borderLeftColor: disciplina?.cor || '#ccc' }}>
                <div className="sessao-card-header">
                    <div className="sessao-categoria">
                        <FontAwesomeIcon icon={faBook} />
                        <span>Bloco {bloco.ordem}</span>
                    </div>
                    <div className="sessao-tempo">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{horasToHHMM(Number(bloco.totalHorasPlanejadas))}</span>
                    </div>
                </div>
                <h4 className="sessao-disciplina">{disciplina?.titulo || 'Disciplina não encontrada'}</h4>
            </div>
        );
    };

    const renderBlocoCardMensal = (bloco) => {
        // O backend retorna bloco.disciplina com os dados completos
        const disciplina = bloco.disciplina || disciplinasPlano.find(d => d.id === bloco.disciplinaId);

        return (
            <div key={bloco.id} className="sessao-card-mensal" style={{ borderLeftColor: disciplina?.cor || '#ccc' }}>
                <div className="sessao-mensal-info">
                    <FontAwesomeIcon icon={faBook} className="sessao-mensal-icon" />
                    <span className="sessao-mensal-disciplina">{disciplina?.titulo || 'N/A'}</span>
                </div>
                <span className="sessao-mensal-tempo">{horasToHHMM(Number(bloco.totalHorasPlanejadas))}</span>
            </div>
        );
    };

    const renderVisualizacaoSemanal = () => {
        console.log('🔄 Renderizando visualização semanal com', blocosEstudo.length, 'blocos no estado');
        return (
            <div className="calendario-semanal">
                {diasSemanaOptions.map((dia) => {
                    const blocos = getBlocosDoDia(dia.id);
                    const totalHoras = calcularTotalHoras(dia.id);

                    return (
                        <div key={dia.id} className="dia-coluna">
                            <div className="dia-header">
                                <h3 className="dia-nome">{dia.sigla}</h3>
                                {totalHoras > 0 && (
                                    <span className="dia-total-horas">
                                        <FontAwesomeIcon icon={faClock} />
                                        {horasToHHMM(totalHoras)}
                                    </span>
                                )}
                            </div>
                            <div className="dia-sessoes">
                                {blocos.length > 0 ? (
                                    blocos.map(bloco => renderBlocoCard(bloco))
                                ) : (
                                    <div className="dia-vazio">
                                        <p>Nenhum bloco planejado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderVisualizacaoMensal = () => {
        console.log('🔄 Renderizando visualização mensal com', blocosEstudo.length, 'blocos no estado');
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
                        const diaSemana = diaInfo.data.getDay();
                        const blocos = getBlocosDoDia(diaSemana);
                        const totalHoras = calcularTotalHoras(diaSemana);

                        return (
                            <div
                                key={index}
                                className={`calendario-mensal-dia ${diaInfo.mesAtual ? 'mes-atual' : 'mes-outro'
                                    } ${blocos.length > 0 ? 'com-sessoes' : ''
                                    }`}
                            >
                                <div className="dia-mensal-header">
                                    <span className="dia-mensal-numero">{diaInfo.dia}</span>
                                    {totalHoras > 0 && (
                                        <span className="dia-mensal-total">
                                            <FontAwesomeIcon icon={faClock} />
                                            {horasToHHMM(totalHoras)}
                                        </span>
                                    )}
                                </div>
                                <div className="dia-mensal-sessoes">
                                    {blocos.map(bloco => renderBlocoCardMensal(bloco))}
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
                                    onChange={(e) => {
                                        const novoPlano = Number(e.target.value);
                                        console.log('🔀 Trocando plano de', planoSelecionado, 'para', novoPlano);
                                        setPlanoSelecionado(novoPlano);
                                    }}
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
                        {blocosEstudo && blocosEstudo.length > 0 ? (
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
                    {loadingBlocos ? (
                        <div className="loading-container">
                            <p>Carregando blocos de estudo...</p>
                        </div>
                    ) : (
                        <>
                            {visualizacao === 'semanal' && renderVisualizacaoSemanal()}
                            {visualizacao === 'mensal' && renderVisualizacaoMensal()}
                        </>
                    )}
                </div>

                {/* Modal de Formulário */}
                <PlanejamentoForm
                    planoEstudoId={planoSelecionado}
                    disciplinas={disciplinasPlano}
                    blocosAtuais={blocosEstudo}
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </Layout>
    );
};

export default Planejamento;
