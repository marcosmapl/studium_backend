import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PlanoEstudoForm from '../components/PlanoEstudoForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { usePlanoEstudoData } from '../hooks/usePlanoEstudoData';
import { useAuth } from '../contexts/AuthContext';
import { createPlanoEstudo, updatePlanoEstudo, deletePlanoEstudo } from '../services/api';
import { toast } from 'react-toastify';
import { formatDateToLocaleString, calculateTotalHours, calculatePerformance } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faBuilding,
    faBriefcase,
    faUniversity,
    faCheckCircle,
    faCirclePlus,
    faClock,
    faBook,
    faCalendar,
    faFire,
    faTachometerAlt,
    faBullseye,
    faTrash,
    faList,
    faEdit,
    faPlayCircle,
    faPauseCircle
} from '@fortawesome/free-solid-svg-icons';
import './PlanosEstudo.css';

const PlanosEstudo = () => {
    // Contexto de autenticação
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // Hook customizado para carregar dados iniciais
    const { loading: loadingData, planosEstudo } = usePlanoEstudoData(usuario?.id);

    // Estado para controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planoParaEditar, setPlanoParaEditar] = useState(null);

    // Estado para controle do diálogo de confirmação
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [planoParaExcluir, setPlanoParaExcluir] = useState(null);

    // Estado local para manipulação dos planos (inicializado com dados do hook)
    const [planos, setPlanos] = useState([]);

    // Atualiza planos quando os dados do hook mudarem
    useEffect(() => {
        if (planosEstudo && planosEstudo.length > 0) {
            setPlanos(planosEstudo);
        }
    }, [planosEstudo]);

    const getSituacaoClass = (descricao) => {
        switch (descricao) {
            case 'Em Andamento':
                return 'situacao-andamento';
            case 'Pausado':
                return 'situacao-pausado';
            case 'Concluído':
                return 'situacao-concluido';
            case 'Novo':
                return 'situacao-novo';
            default:
                return '';
        }
    };

    const getSituacaoIcon = (descricao) => {
        switch (descricao) {
            case 'Em Andamento':
                return faPlayCircle;
            case 'Pausado':
                return faPauseCircle;
            case 'Concluído':
                return faCheckCircle;
            case 'Novo':
                return faCirclePlus;
            default:
                return '';
        }
    };

    const handleNovoPlano = () => {
        setPlanoParaEditar(null);
        setIsModalOpen(true);
    };

    const handleEditarPlano = (plano) => {
        setPlanoParaEditar(plano);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPlanoParaEditar(null);
    };

    const handleSavePlano = async (planoData) => {
        try {
            if (planoParaEditar) {
                // Editar plano existente
                await updatePlanoEstudo(planoData.id, planoData);
                setPlanos(planos.map(p => p.id === planoData.id ? { ...p, ...planoData } : p));
                toast.success('Plano atualizado com sucesso!');
            } else {
                // Adicionar novo plano - precisa incluir usuarioId e situacaoId
                const novoPlanoData = {
                    ...planoData,
                    usuarioId: usuario.id,
                    situacaoId: 1 // "Em Andamento" - ajustar conforme necessário
                };
                const response = await createPlanoEstudo(novoPlanoData);
                setPlanos([...planos, response.data]);
                toast.success('Plano criado com sucesso!');
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao salvar plano de estudo');
        }
    };

    const handleExcluirPlano = (plano) => {
        setPlanoParaExcluir(plano);
        setIsConfirmOpen(true);
    };

    const handleConfirmExclusao = async () => {
        if (planoParaExcluir) {
            try {
                await deletePlanoEstudo(planoParaExcluir.id);
                setPlanos(planos.filter(p => p.id !== planoParaExcluir.id));
                toast.success('Plano excluído com sucesso!');
            } catch (error) {
                toast.error(error.response?.data?.error || 'Erro ao excluir plano de estudo');
            }
        }
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    };

    const handleCancelExclusao = () => {
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    };

    const handleVerDisciplinas = (planoId) => {
        navigate('/disciplinas', { state: { planoId } });
    };

    return (
        <Layout>
            <div className="planos-container">
                <div className="studium-page-header planos-header">
                    <h2 className="studium-page-title planos-title">Planos de Estudo</h2>
                    <button className="btn btn-primary" onClick={handleNovoPlano}>
                        <FontAwesomeIcon icon={faPlus} />
                        Novo Plano
                    </button>
                </div>

                {loadingData ? (
                    <div className="loading-message">Carregando planos de estudo...</div>
                ) : planos.length === 0 ? (
                    <div className="empty-message">Nenhum plano de estudo encontrado. Crie seu primeiro plano!</div>
                ) : (
                    <div className="planos-lista">
                        {planos.map((plano) => (
                            <div key={plano.id} className="studium-card-base">
                                {/* Cabeçalho do Card */}
                                <div className="studium-card-header">
                                    <div className="plano-titulo-wrapper">
                                        <h3 className="studium-card-title">{plano.titulo}</h3>
                                        <span className={`plano-situacao ${getSituacaoClass(plano.situacao.descricao)}`}>
                                            <FontAwesomeIcon icon={getSituacaoIcon(plano.situacao.descricao)} />
                                            {plano.situacao.descricao}
                                        </span>
                                    </div>
                                </div>

                                {/* Informações do Concurso */}
                                <div className="plano-info-concurso">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faBuilding} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Concurso</span>
                                            <span className="info-value">{plano.concurso}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faBriefcase} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Cargo</span>
                                            <span className="info-value">{plano.cargo}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faUniversity} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Banca</span>
                                            <span className="info-value">{plano.banca}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FontAwesomeIcon icon={faCalendar} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Data da Prova</span>
                                            <span className="info-value">{formatDateToLocaleString(plano.dataProva)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progresso Geral */}
                                <div className="plano-progresso-section">
                                    <div className="progresso-header">
                                        <span className="progresso-label">Progresso Geral</span>
                                        <span className="progresso-percentual">{plano.progressoGeral | 0}%</span>
                                    </div>
                                    <div className="progresso-barra-container">
                                        <div
                                            className="progresso-barra-preenchida"
                                            style={{ width: `${plano.progressoGeral | 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Estatísticas do Plano */}
                                <div className="studium-stats-grid">
                                    <div className="studium-stats-item">
                                        <div className="studium-stats-icon">
                                            <FontAwesomeIcon icon={faClock} />
                                        </div>
                                        <div className="studium-stats-content">
                                            <span className="studium-stats-label">Horas Estudadas</span>
                                            <span className="studium-stats-valor">{calculateTotalHours(plano.sessoesEstudo)}h</span>
                                        </div>
                                    </div>
                                    <div className="studium-stats-item">
                                        <FontAwesomeIcon icon={faBook} className="studium-stats-icon" />
                                        <div className="studium-stats-content">
                                            <span className="studium-stats-label">Disciplinas</span>
                                            <span className="studium-stats-valor">{plano.disciplinas?.length | 0}</span>
                                        </div>
                                    </div>
                                    <div className="studium-stats-item">
                                        <FontAwesomeIcon icon={faFire} className="studium-stats-icon" />
                                        <div className="studium-stats-content">
                                            <span className="studium-stats-label">Constância</span>
                                            <span className="studium-stats-valor">{plano.constancia}%</span>
                                        </div>
                                    </div>
                                    <div className="studium-stats-item">
                                        <FontAwesomeIcon icon={faTachometerAlt} className="studium-stats-icon" />
                                        <div className="studium-stats-content">
                                            <span className="studium-stats-label">Ritmo Atual</span>
                                            <span className="studium-stats-valor">
                                                {plano.ritmoAtual > 0 ? `${plano.ritmoAtual}h/dia` : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="studium-stats-item">
                                        <FontAwesomeIcon icon={faBullseye} className="studium-stats-icon" />
                                        <div className="studium-stats-content">
                                            <span className="studium-stats-label">Desempenho</span>
                                            <span className="studium-stats-valor">{calculatePerformance(plano.sessoesEstudo)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rodapé do Card */}
                                <div className="studium-card-footer">
                                    <span className="plano-data-criacao">
                                        Criado em {formatDateToLocaleString(plano.createdAt)}
                                    </span>
                                    <div className="studium-card-footer-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleVerDisciplinas(plano.id)}
                                        >
                                            <FontAwesomeIcon icon={faBook} />
                                            Ver Disciplinas
                                        </button>
                                        <button className="btn btn-secondary">
                                            <FontAwesomeIcon icon={faList} />
                                            Ver Sessões
                                        </button>
                                        <button className="btn btn-secondary">
                                            <FontAwesomeIcon icon={faCalendar} />
                                            Ver Planejamento
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditarPlano(plano)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleExcluirPlano(plano)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de Cadastro/Edição */}
                <PlanoEstudoForm
                    plano={planoParaEditar}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSavePlano}
                />

                {/* Diálogo de Confirmação de Exclusão */}
                <ConfirmDialog
                    isOpen={isConfirmOpen}
                    title="Confirmação de Exclusão"
                    message="Este ação irá excluir o plano de estudo e todas as disciplinas, tópicos, sessões, revisões e planejamentos associados. Deseja realmente excluir?"
                    onConfirm={handleConfirmExclusao}
                    onCancel={handleCancelExclusao}
                />
            </div>
        </Layout>
    );
};

export default PlanosEstudo;
