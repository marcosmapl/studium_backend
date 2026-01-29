import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import SessaoEstudoForm from '../components/SessaoEstudoForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePlanoEstudoContext } from '../contexts/PlanoEstudoContext';
import { useAuth } from '../contexts/AuthContext';
import { horasToHHMM } from '../utils/utils';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faFileLines,
    faEdit,
    faTrash,
    faRotate,
    faGraduationCap,
    faCommentDots
} from '@fortawesome/free-solid-svg-icons';
import './Historico.css';

const Historico = () => {
    const { usuario } = useAuth();
    const location = useLocation();
    const { planoSelecionado } = usePlanoEstudoContext();

    const [sessoes, setSessoes] = useState([]);
    const [revisoes, setRevisoes] = useState([]);
    const [loadingDados, setLoadingDados] = useState(false);
    const [disciplinasMap, setDisciplinasMap] = useState(new Map());
    const [topicosMap, setTopicosMap] = useState(new Map());

    // Estados para edição de sessão
    const [isSessaoFormOpen, setIsSessaoFormOpen] = useState(false);
    const [sessaoParaEditar, setSessaoParaEditar] = useState(null);
    const [blocoEstudo, setBlocoEstudo] = useState(null);

    // Estados para confirmação de exclusão
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemParaExcluir, setItemParaExcluir] = useState(null);
    const [tipoExclusao, setTipoExclusao] = useState(null); // 'sessao' ou 'revisao'

    // Carrega dados quando plano muda
    useEffect(() => {
        const carregarDados = async () => {
            if (!planoSelecionado) return;

            setLoadingDados(true);
            try {
                const [sessoesRes, revisoesRes, disciplinasRes] = await Promise.all([
                    api.get(`/sessaoEstudo/planoEstudo/${planoSelecionado}`),
                    api.get(`/revisao/planoEstudo/${planoSelecionado}`),
                    api.get(`/disciplina/plano/${planoSelecionado}`)
                ]);

                setSessoes(sessoesRes.data || []);
                setRevisoes(revisoesRes.data || []);

                // Criar mapa de disciplinas
                const discMap = new Map();
                const topicoMap = new Map();

                (disciplinasRes.data || []).forEach(disc => {
                    discMap.set(disc.id, disc);
                    if (disc.topicos) {
                        disc.topicos.forEach(topico => {
                            topicoMap.set(topico.id, topico);
                        });
                    }
                });

                setDisciplinasMap(discMap);
                setTopicosMap(topicoMap);
            } catch (error) {
                if (error.response?.status !== 404) {
                    toast.error('Erro ao carregar histórico');
                }
                setSessoes([]);
                setRevisoes([]);
            } finally {
                setLoadingDados(false);
            }
        };

        carregarDados();
    }, [planoSelecionado]);

    // Agrupa registros por data
    const registrosPorData = useMemo(() => {
        const registros = [];

        // Adiciona sessões
        sessoes.forEach(sessao => {
            registros.push({
                tipo: 'sessao',
                data: new Date(sessao.dataInicio),
                item: sessao
            });
        });

        // Adiciona revisões
        revisoes.forEach(revisao => {
            if (revisao.dataRealizacao) {
                registros.push({
                    tipo: 'revisao',
                    data: new Date(revisao.dataRealizacao),
                    item: revisao
                });
            }
        });

        // Ordena por data decrescente
        registros.sort((a, b) => b.data - a.data);

        // Agrupa por data
        const grupos = {};
        registros.forEach(registro => {
            const dataKey = registro.data.toISOString().split('T')[0];
            if (!grupos[dataKey]) {
                grupos[dataKey] = [];
            }
            grupos[dataKey].push(registro);
        });

        return grupos;
    }, [sessoes, revisoes]);

    const handleEditarSessao = async (sessao) => {
        try {
            // Buscar bloco de estudo
            if (sessao.blocoEstudoId) {
                const blocoRes = await api.get(`/blocoEstudo/${sessao.blocoEstudoId}`);
                setBlocoEstudo(blocoRes.data);
            }
            setSessaoParaEditar(sessao);
            setIsSessaoFormOpen(true);
        } catch (error) {
            toast.error('Erro ao abrir formulário de edição');
        }
    };

    const handleExcluirSessao = (sessao) => {
        setItemParaExcluir(sessao);
        setTipoExclusao('sessao');
        setIsConfirmOpen(true);
    };

    const handleExcluirRevisao = (revisao) => {
        setItemParaExcluir(revisao);
        setTipoExclusao('revisao');
        setIsConfirmOpen(true);
    };

    const handleConfirmExclusao = async () => {
        if (!itemParaExcluir) return;

        try {
            if (tipoExclusao === 'sessao') {
                await excluirSessao(itemParaExcluir);
            } else if (tipoExclusao === 'revisao') {
                await excluirRevisao(itemParaExcluir);
            }
        } catch (error) {
            toast.error('Erro ao excluir registro');
        } finally {
            setIsConfirmOpen(false);
            setItemParaExcluir(null);
            setTipoExclusao(null);
        }
    };

    const excluirSessao = async (sessao) => {
        // 1. Excluir a sessão
        await api.delete(`/sessaoEstudo/${sessao.id}`);

        // 2. Verificar se tópico estava marcado como concluído
        if (sessao.topicoFinalizado) {
            await api.put(`/topico/${sessao.topicoId}`, {
                concluido: false
            });
        }

        // 3. Verificar bloco de estudo
        if (sessao.blocoEstudoId) {
            try {
                const sessoesRes = await api.get(`/sessaoEstudo/blocoEstudo/${sessao.blocoEstudoId}`);
                const sessoesRestantes = sessoesRes.data.filter(s => s.id !== sessao.id);
                const totalEstudado = sessoesRestantes.reduce((sum, s) => sum + Number(s.tempoEstudo), 0);

                const blocoRes = await api.get(`/blocoEstudo/${sessao.blocoEstudoId}`);
                const bloco = blocoRes.data;

                if (totalEstudado < Number(bloco.totalHorasPlanejadas)) {
                    await api.put(`/blocoEstudo/${sessao.blocoEstudoId}`, {
                        concluido: false
                    });
                }
            } catch (error) {
                // Se não encontrou sessões (404), significa que essa era a única sessão
                // Nesse caso, marcar o bloco como não concluído
                if (error.response?.status === 404) {
                    await api.put(`/blocoEstudo/${sessao.blocoEstudoId}`, {
                        concluido: false
                    });
                } else {
                    throw error;
                }
            }
        }

        // Atualizar lista local
        setSessoes(sessoes.filter(s => s.id !== sessao.id));
        toast.success('Sessão excluída com sucesso!');
    };

    const excluirRevisao = async (revisao) => {
        // 1. Excluir a revisão
        await api.delete(`/revisao/${revisao.id}`);

        // 2. Buscar revisões restantes do mesmo tópico
        const revisoesRes = await api.get(`/revisao/topico/${revisao.topicoId}`);
        const revisoesRestantes = revisoesRes.data
            .filter(r => r.id !== revisao.id)
            .sort((a, b) => a.numero - b.numero);

        // 3. Atualizar números das revisões restantes
        for (let i = 0; i < revisoesRestantes.length; i++) {
            const novoNumero = i + 1;
            if (revisoesRestantes[i].numero !== novoNumero) {
                await api.put(`/revisao/${revisoesRestantes[i].id}`, {
                    numero: novoNumero
                });
            }
        }

        // Atualizar lista local
        setRevisoes(revisoes.filter(r => r.id !== revisao.id));
        toast.success('Revisão excluída com sucesso!');
    };

    const handleSessaoSuccess = async () => {
        // Recarregar sessões
        try {
            const sessoesRes = await api.get(`/sessaoEstudo/planoEstudo/${planoSelecionado}`);
            setSessoes(sessoesRes.data || []);
        } catch (error) {
            toast.success('Erro ao recarregar sessões:', error);
        }
    };

    const calcularPercentualAcertos = (acertos, erros) => {
        const total = acertos + erros;
        if (total === 0) return 0;
        return Math.round((acertos / total) * 100);
    };

    const formatarData = (data) => {
        const d = new Date(data);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);

        const dataStr = d.toISOString().split('T')[0];
        const hojeStr = hoje.toISOString().split('T')[0];
        const ontemStr = ontem.toISOString().split('T')[0];

        if (dataStr === hojeStr) return 'Hoje';
        if (dataStr === ontemStr) return 'Ontem';

        return d.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout>
            <div className="studium-container">
                <div className="studium-page-header historico-header">
                    <div className="historico-header-left">
                        <h2 className="studium-page-title">Histórico de Estudos</h2>
                    </div>
                </div>

                {loadingDados ? (
                    <div className="loading-message">Carregando histórico...</div>
                ) : (
                    <div className="historico-timeline">
                        {Object.keys(registrosPorData).length === 0 ? (
                            <div className="historico-vazio">
                                <p>Nenhum registro de estudo encontrado para este plano.</p>
                            </div>
                        ) : (
                            Object.entries(registrosPorData).map(([data, registros]) => (
                                <div key={data} className="historico-dia">
                                    <div className="historico-dia-header">
                                        <h3 className="historico-dia-titulo">{formatarData(data)}</h3>
                                        <span className="historico-dia-data">
                                            {new Date(data).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>

                                    <div className="historico-registros">
                                        {registros.map((registro, index) => {
                                            if (registro.tipo === 'sessao') {
                                                const sessao = registro.item;
                                                const disciplina = disciplinasMap.get(sessao.disciplinaId);
                                                const topico = topicosMap.get(sessao.topicoId);
                                                const totalQuestoes = sessao.questoesAcertos + sessao.questoesErros;
                                                const percentualAcertos = calcularPercentualAcertos(
                                                    sessao.questoesAcertos,
                                                    sessao.questoesErros
                                                );

                                                return (
                                                    <div key={`sessao-${sessao.id}`} className="historico-card sessao-card">
                                                        <div className="historico-card-header">
                                                            <div className="historico-card-tipo">
                                                                <FontAwesomeIcon icon={faBook} />
                                                                <span>Sessão de Estudo</span>
                                                            </div>
                                                            <div className="historico-card-actions">
                                                                <button
                                                                    className="btn-icon btn-edit"
                                                                    onClick={() => handleEditarSessao(sessao)}
                                                                    title="Editar sessão"
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon btn-danger"
                                                                    onClick={() => handleExcluirSessao(sessao)}
                                                                    title="Excluir sessão"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="historico-card-body">
                                                            <div className="historico-info-principal">
                                                                <div className="historico-disciplina-topico">
                                                                    <span
                                                                        className="historico-disciplina-badge"
                                                                        style={{ backgroundColor: disciplina?.cor || '#6c757d' }}
                                                                    >
                                                                        {disciplina?.titulo || 'Disciplina não encontrada'}
                                                                    </span>
                                                                    <span className="historico-topico">
                                                                        {topico?.titulo || 'Tópico não encontrado'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="historico-stats">
                                                                <div className="historico-stat">
                                                                    <FontAwesomeIcon icon={faClock} />
                                                                    <span>{horasToHHMM(sessao.tempoEstudo)}</span>
                                                                </div>
                                                                {totalQuestoes > 0 && (
                                                                    <div className="historico-stat">
                                                                        <FontAwesomeIcon icon={faCheckCircle} className="icon-success" />
                                                                        <span>{sessao.questoesAcertos}</span>
                                                                        <FontAwesomeIcon icon={faTimesCircle} className="icon-danger" />
                                                                        <span>{sessao.questoesErros}</span>
                                                                        <span className="historico-percentual">
                                                                            ({percentualAcertos}%)
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {sessao.paginasLidas > 0 && (
                                                                    <div className="historico-stat">
                                                                        <FontAwesomeIcon icon={faFileLines} />
                                                                        <span>{sessao.paginasLidas} páginas</span>
                                                                    </div>
                                                                )}
                                                                {sessao.observacoes && (
                                                                    <div className="historico-stat historico-observacoes-icon">
                                                                        <FontAwesomeIcon icon={faCommentDots} />
                                                                        <div className="historico-observacoes-tooltip">
                                                                            {sessao.observacoes}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                const revisao = registro.item;
                                                const disciplina = disciplinasMap.get(revisao.disciplinaId);
                                                const topico = topicosMap.get(revisao.topicoId);
                                                const totalQuestoes = revisao.questoesAcertos + revisao.questoesErros;
                                                const percentualAcertos = calcularPercentualAcertos(
                                                    revisao.questoesAcertos,
                                                    revisao.questoesErros
                                                );

                                                return (
                                                    <div key={`revisao-${revisao.id}`} className="historico-card revisao-card">
                                                        <div className="historico-card-header">
                                                            <div className="historico-card-tipo">
                                                                <FontAwesomeIcon icon={faRotate} />
                                                                <span>Revisão #{revisao.numero}</span>
                                                            </div>
                                                            <div className="historico-card-actions">
                                                                <button
                                                                    className="btn-icon btn-edit"
                                                                    title="Editar revisão (não implementado)"
                                                                    disabled
                                                                >
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </button>
                                                                <button
                                                                    className="btn-icon btn-danger"
                                                                    onClick={() => handleExcluirRevisao(revisao)}
                                                                    title="Excluir revisão"
                                                                >
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="historico-card-body">
                                                            <div className="historico-info-principal">
                                                                <div className="historico-disciplina-topico">
                                                                    <span
                                                                        className="historico-disciplina-badge"
                                                                        style={{ backgroundColor: disciplina?.cor || '#6c757d' }}
                                                                    >
                                                                        {disciplina?.titulo || 'Disciplina não encontrada'}
                                                                    </span>
                                                                    <span className="historico-topico">
                                                                        {topico?.titulo || 'Tópico não encontrado'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="historico-stats">
                                                                {revisao.tempoEstudo && (
                                                                    <div className="historico-stat">
                                                                        <FontAwesomeIcon icon={faClock} />
                                                                        <span>{horasToHHMM(revisao.tempoEstudo)}</span>
                                                                    </div>
                                                                )}
                                                                {totalQuestoes > 0 && (
                                                                    <div className="historico-stat">
                                                                        <FontAwesomeIcon icon={faCheckCircle} className="icon-success" />
                                                                        <span>{revisao.questoesAcertos}</span>
                                                                        <FontAwesomeIcon icon={faTimesCircle} className="icon-danger" />
                                                                        <span>{revisao.questoesErros}</span>
                                                                        <span className="historico-percentual">
                                                                            ({percentualAcertos}%)
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {revisao.desempenho !== null && (
                                                                    <div className="historico-stat">
                                                                        <FontAwesomeIcon icon={faGraduationCap} />
                                                                        <span>Desempenho: {revisao.desempenho}%</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Modal de Edição de Sessão */}
                {sessaoParaEditar && blocoEstudo && (
                    <SessaoEstudoForm
                        isOpen={isSessaoFormOpen}
                        onClose={() => {
                            setIsSessaoFormOpen(false);
                            setSessaoParaEditar(null);
                            setBlocoEstudo(null);
                        }}
                        blocoEstudo={blocoEstudo}
                        disciplina={disciplinasMap.get(sessaoParaEditar.disciplinaId)}
                        planoEstudoId={planoSelecionado}
                        onSuccess={handleSessaoSuccess}
                        sessaoExistente={sessaoParaEditar}
                    />
                )}

                {/* Diálogo de Confirmação */}
                <ConfirmDialog
                    isOpen={isConfirmOpen}
                    title="Confirmação de Exclusão"
                    message={`Deseja realmente excluir ${tipoExclusao === 'sessao' ? 'esta sessão de estudo' : 'esta revisão'}?`}
                    onConfirm={handleConfirmExclusao}
                    onCancel={() => {
                        setIsConfirmOpen(false);
                        setItemParaExcluir(null);
                        setTipoExclusao(null);
                    }}
                />
            </div>
        </Layout>
    );
};

export default Historico;
