import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DisciplinaForm from '../components/DisciplinaForm';
import ConfirmDialog from '../components/ConfirmDialog';
import TopicosModal from '../components/TopicosModal';
import { usePlanoEstudoContext } from '../contexts/PlanoEstudoContext';
import { useAuth } from '../contexts/AuthContext';
import { getDisciplinasByPlanoId, createDisciplina, updateDisciplina, deleteDisciplina } from '../services/api';
import { formatDateToLocaleString, calculateTotalHours, calculatePerformance, calculateTopicCoverage } from '../utils/utils';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faExclamationCircle,
    faClock,
    faListCheck,
    faBullseye,
    faChartPie,
    faList,
    faChartBar,
    faEdit,
    faTrash,
    faGraduationCap,
    faClone
} from '@fortawesome/free-solid-svg-icons';
import './Disciplinas.css';

const Disciplinas = () => {
    // Contexto de autenticação
    const { usuario } = useAuth();
    const location = useLocation();

    // Contexto global do plano de estudo
    const { planoSelecionado } = usePlanoEstudoContext();

    // Estado para controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null);

    // Estado para controle do diálogo de confirmação
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState(null);

    // Estado para controle do modal de tópicos
    const [isTopicosModalOpen, setIsTopicosModalOpen] = useState(false);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);

    const [disciplinas, setDisciplinas] = useState([]);
    const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);

    // Carregar disciplinas quando plano mudar
    useEffect(() => {
        const carregarDisciplinas = async () => {
            if (!planoSelecionado) return;

            setLoadingDisciplinas(true);
            try {
                const response = await getDisciplinasByPlanoId(planoSelecionado);
                setDisciplinas(response.data || []);
            } catch (error) {
                if (error.response?.status !== 404) {
                    toast.error('Erro ao carregar disciplinas');
                }
                setDisciplinas([]);
            } finally {
                setLoadingDisciplinas(false);
            }
        };

        carregarDisciplinas();
    }, [planoSelecionado]);

    const handleNovaDisciplina = () => {
        setDisciplinaParaEditar(null);
        setIsModalOpen(true);
    };

    const handleEditarDisciplina = (disciplina) => {
        setDisciplinaParaEditar(disciplina);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setDisciplinaParaEditar(null);
    };

    const handleSaveDisciplina = async (disciplinaData) => {
        try {
            if (disciplinaParaEditar) {
                // Editar disciplina existente
                await updateDisciplina(disciplinaData.id, disciplinaData);
                setDisciplinas(disciplinas.map(d => d.id === disciplinaData.id ? { ...d, ...disciplinaData } : d));
                toast.success('Disciplina atualizada com sucesso!');
            } else {
                // Adicionar nova disciplina
                const novaDisciplinaData = {
                    ...disciplinaData,
                    planoId: planoSelecionado
                };
                const response = await createDisciplina(novaDisciplinaData);
                setDisciplinas([...disciplinas, response.data]);
                toast.success('Disciplina criada com sucesso!');
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao salvar disciplina');
        }
    };

    const handleExcluirDisciplina = (disciplina) => {
        setDisciplinaParaExcluir(disciplina);
        setIsConfirmOpen(true);
    };

    const handleConfirmExclusao = async () => {
        if (disciplinaParaExcluir) {
            try {
                await deleteDisciplina(disciplinaParaExcluir.id);
                setDisciplinas(disciplinas.filter(d => d.id !== disciplinaParaExcluir.id));
                toast.success('Disciplina excluída com sucesso!');
            } catch (error) {
                toast.error(error.response?.data?.error || 'Erro ao excluir disciplina');
            }
        }
        setIsConfirmOpen(false);
        setDisciplinaParaExcluir(null);
    };

    const handleCancelExclusao = () => {
        setIsConfirmOpen(false);
        setDisciplinaParaExcluir(null);
    };

    const handleVerTopicos = (disciplina) => {
        setDisciplinaSelecionada(disciplina);
        setIsTopicosModalOpen(true);
    };

    const handleCloseTopicosModal = () => {
        setIsTopicosModalOpen(false);
        setDisciplinaSelecionada(null);
    };

    return (
        <Layout>
            <div className="studium-container">
                <div className="studium-page-header disciplinas-header">
                    <div className="disciplinas-header-left">
                        <h2 className="studium-page-title">Disciplinas</h2>
                    </div>
                    <div className="disciplinas-header-right">
                        <button
                            className="btn btn-primary"
                            onClick={handleNovaDisciplina}
                            disabled={!planoSelecionado}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Nova Disciplina
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNovaDisciplina}
                            disabled={!planoSelecionado}
                        >
                            <FontAwesomeIcon icon={faClone} />
                            Copiar Modelo
                        </button>
                    </div>
                </div>

                {loadingDisciplinas ? (
                    <div className="loading-message">Carregando disciplinas...</div>
                ) : (
                    <div className="disciplinas-lista">
                        {disciplinas.length === 0 ? (
                            <div className="disciplinas-vazio">
                                <p>
                                    {!planoSelecionado
                                        ? 'Selecione um plano de estudo para gerenciar disciplinas.'
                                        : 'Nenhuma disciplina cadastrada para este plano.'}
                                </p>
                            </div>
                        ) : (
                            disciplinas.map((disciplina) => (
                                <div key={disciplina.id} className="studium-card-base">
                                    {/* Cabeçalho do Card */}
                                    <div className="studium-card-header disciplina-card-header">
                                        <h3 className="disciplina-nome">{disciplina.titulo}</h3>
                                    </div>

                                    {/* Estatísticas da Disciplina */}
                                    <div className="studium-stats-grid">
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Importância</span>
                                                <span className="studium-stats-valor">{Number(disciplina.importancia).toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faGraduationCap} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Conhecimento</span>
                                                <span className="studium-stats-valor">{Number(disciplina.conhecimento).toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faListCheck} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Tópicos</span>
                                                <span className="studium-stats-valor">{disciplina.topicos?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faClock} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Horas Estudadas</span>
                                                <span className="studium-stats-valor">{calculateTotalHours(disciplina.sessoesEstudo)}h</span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faBullseye} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Desempenho</span>
                                                <span className="studium-stats-valor">
                                                    {calculatePerformance(disciplina.sessoesEstudo)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faChartPie} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Cobertura</span>
                                                <span className="studium-stats-valor">
                                                    {calculateTopicCoverage(disciplina.topicos)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rodapé do Card */}
                                    <div className="studium-card-footer">
                                        <span className="disciplina-data-criacao">
                                            Criado em {formatDateToLocaleString(disciplina.createdAt)}
                                        </span>
                                        <div className="studium-card-footer-actions">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleVerTopicos(disciplina)}
                                            >
                                                <FontAwesomeIcon icon={faList} />
                                                Ver Tópicos
                                            </button>
                                            {/* <button className="btn btn-secondary">
                                                <FontAwesomeIcon icon={faChartBar} />
                                                Ver Estatísticas
                                            </button> */}
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleEditarDisciplina(disciplina)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleExcluirDisciplina(disciplina)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Modal de Cadastro/Edição */}
                <DisciplinaForm
                    disciplina={disciplinaParaEditar}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSaveDisciplina}
                    planoId={planoSelecionado}
                />

                {/* Diálogo de Confirmação de Exclusão */}
                <ConfirmDialog
                    isOpen={isConfirmOpen}
                    title="Confirmação de Exclusão"
                    message="Deseja realmente excluir essa Disciplina?"
                    onConfirm={handleConfirmExclusao}
                    onCancel={handleCancelExclusao}
                />

                {/* Modal de Tópicos */}
                <TopicosModal
                    isOpen={isTopicosModalOpen}
                    onClose={handleCloseTopicosModal}
                    disciplina={disciplinaSelecionada}
                />
            </div>
        </Layout>
    );
};

export default Disciplinas;
