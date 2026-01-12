import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DisciplinaForm from '../components/DisciplinaForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePlanoEstudoData } from '../hooks/usePlanoEstudoData';
import { useAuth } from '../contexts/AuthContext';
import { getDisciplinasByPlanoId, createDisciplina, updateDisciplina, deleteDisciplina } from '../services/api';
import { formatDateToLocaleString, calculateTotalHours, calculatePerformance, calculateTopicCoverage } from '../utils/utils';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faWeightHanging,
    faClock,
    faListCheck,
    faBullseye,
    faChartPie,
    faList,
    faChartBar,
    faEdit,
    faTrash,
    faStar,
    faClone
} from '@fortawesome/free-solid-svg-icons';
import './Disciplinas.css';

const Disciplinas = () => {
    // Contexto de autenticação
    const { usuario } = useAuth();
    const location = useLocation();

    // Hook customizado para carregar planos de estudo
    const { loading: loadingPlanos, planosEstudo } = usePlanoEstudoData(usuario?.id);

    // Estado para controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null);

    // Estado para controle do diálogo de confirmação
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState(null);

    // Estado para o plano selecionado - pega do state de navegação ou primeiro plano
    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [disciplinas, setDisciplinas] = useState([]);
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

    // Carregar disciplinas quando plano mudar
    useEffect(() => {
        const carregarDisciplinas = async () => {
            if (!planoSelecionado) return;

            setLoadingDisciplinas(true);
            try {
                const response = await getDisciplinasByPlanoId(planoSelecionado);
                // console.log('Disciplinas carregadas:', response.data);
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
            console.error('Erro ao salvar disciplina:', error);
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
                console.error('Erro ao excluir disciplina:', error);
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

    return (
        <Layout>
            <div className="disciplinas-container">
                <div className="studium-page-header disciplinas-header">
                    <div className="disciplinas-header-left">
                        <h2 className="studium-page-title disciplinas-title">Disciplinas</h2>
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
                                <p>Nenhuma disciplina cadastrada para este plano.</p>
                                <button className="btn btn btn-primary" onClick={handleNovaDisciplina}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    Adicionar Primeira Disciplina
                                </button>
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
                                                <FontAwesomeIcon icon={faWeightHanging} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Peso</span>
                                                <span className="studium-stats-valor">{disciplina.peso}</span>
                                            </div>
                                        </div>
                                        <div className="studium-stats-item">
                                            <div className="studium-stats-icon">
                                                <FontAwesomeIcon icon={faStar} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Familiaridade</span>
                                                <span className="studium-stats-valor">{disciplina.familiaridade || 0}</span>
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
                                                <FontAwesomeIcon icon={faListCheck} />
                                            </div>
                                            <div className="studium-stats-content">
                                                <span className="studium-stats-label">Tópicos</span>
                                                <span className="studium-stats-valor">{disciplina.topicos?.length || 0}</span>
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
                                            <button className="btn btn-secondary">
                                                <FontAwesomeIcon icon={faList} />
                                                Ver Tópicos
                                            </button>
                                            <button className="btn btn-secondary">
                                                <FontAwesomeIcon icon={faChartBar} />
                                                Ver Estatísticas
                                            </button>
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
                    message="Deseja realmente excluir?"
                    onConfirm={handleConfirmExclusao}
                    onCancel={handleCancelExclusao}
                />
            </div>
        </Layout>
    );
};

export default Disciplinas;
