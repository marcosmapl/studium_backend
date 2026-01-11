import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import PlanoEstudoForm from '../components/PlanoEstudoForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faBuilding,
    faBriefcase,
    faUniversity,
    faCheckCircle,
    faClock,
    faBook,
    faCalendar,
    faChartLine,
    faFire,
    faTachometerAlt,
    faBullseye,
    faTrash,
    faList,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import './PlanosEstudo.css';

const PlanosEstudo = () => {
    // Estado para controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planoParaEditar, setPlanoParaEditar] = useState(null);

    // Estado para controle do diálogo de confirmação
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [planoParaExcluir, setPlanoParaExcluir] = useState(null);

    // Dados mockados para demonstração
    const [planos, setPlanos] = useState([
        {
            id: 1,
            titulo: 'Plano Preparatório TRF 2024',
            concurso: 'TRF - Tribunal Regional Federal',
            cargo: 'Analista Judiciário - Área Administrativa',
            banca: 'CESPE/CEBRASPE',
            situacao: 'Em Andamento',
            progressoGeral: 67,
            dataCriacao: '2024-01-15',
            dataProva: '2025-01-15',
            totalDisciplinas: 12,
            horasEstudadas: 248,
            constancia: 87,
            ritmoAtual: 4.5,
            eficienciaGeral: 78
        },
        {
            id: 2,
            titulo: 'Preparação Concurso Polícia Federal',
            concurso: 'Polícia Federal',
            cargo: 'Agente de Polícia Federal',
            banca: 'CESPE/CEBRASPE',
            situacao: 'Em Andamento',
            progressoGeral: 45,
            dataCriacao: '2024-03-10',
            dataProva: '2025-03-10',
            totalDisciplinas: 15,
            horasEstudadas: 156,
            constancia: 75,
            ritmoAtual: 3.8,
            eficienciaGeral: 82
        },
        {
            id: 3,
            titulo: 'Concurso Banco do Brasil 2024',
            concurso: 'Banco do Brasil',
            cargo: 'Escriturário',
            banca: 'FCC - Fundação Carlos Chagas',
            situacao: 'Concluído',
            progressoGeral: 100,
            dataCriacao: '2023-11-05',
            dataProva: '2024-11-05',
            totalDisciplinas: 8,
            horasEstudadas: 420,
            constancia: 92,
            ritmoAtual: 0,
            eficienciaGeral: 88
        },
        {
            id: 4,
            titulo: 'Plano TCU - Auditor Federal',
            concurso: 'TCU - Tribunal de Contas da União',
            cargo: 'Auditor Federal de Controle Externo',
            banca: 'CESPE/CEBRASPE',
            situacao: 'Pausado',
            progressoGeral: 23,
            dataCriacao: '2024-05-20',
            dataProva: '2025-05-20',
            totalDisciplinas: 18,
            horasEstudadas: 89,
            constancia: 45,
            ritmoAtual: 0,
            eficienciaGeral: 71
        }
    ]);

    const getSituacaoClass = (situacao) => {
        switch (situacao) {
            case 'Em Andamento':
                return 'situacao-andamento';
            case 'Concluído':
                return 'situacao-concluido';
            case 'Pausado':
                return 'situacao-pausado';
            default:
                return '';
        }
    };

    const formatarData = (dataStr) => {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

    const handleSavePlano = (planoData) => {
        if (planoParaEditar) {
            // Editar plano existente
            setPlanos(planos.map(p => p.id === planoData.id ? planoData : p));
            console.log('Plano atualizado:', planoData);
        } else {
            // Adicionar novo plano
            setPlanos([...planos, planoData]);
            console.log('Novo plano criado:', planoData);
        }
    };

    const handleExcluirPlano = (plano) => {
        setPlanoParaExcluir(plano);
        setIsConfirmOpen(true);
    };

    const handleConfirmExclusao = () => {
        if (planoParaExcluir) {
            setPlanos(planos.filter(p => p.id !== planoParaExcluir.id));
            console.log('Plano excluído:', planoParaExcluir.titulo);
        }
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    };

    const handleCancelExclusao = () => {
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    };

    return (
        <Layout>
            <div className="planos-container">
                <div className="planos-header">
                    <h2 className="planos-title">Planos de Estudo</h2>
                    <button className="btn-novo-plano" onClick={handleNovoPlano}>
                        <FontAwesomeIcon icon={faPlus} />
                        Novo Plano
                    </button>
                </div>

                <div className="planos-lista">
                    {planos.map((plano) => (
                        <div key={plano.id} className="plano-card">
                            {/* Cabeçalho do Card */}
                            <div className="plano-card-header">
                                <div className="plano-titulo-wrapper">
                                    <h3 className="plano-titulo">{plano.titulo}</h3>
                                    <span className={`plano-situacao ${getSituacaoClass(plano.situacao)}`}>
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        {plano.situacao}
                                    </span>
                                </div>
                            </div>

                            {/* Informações do Concurso */}
                            <div className="plano-info-concurso">
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faBuilding} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">Concurso</span>
                                        <span className="info-value">{plano.concurso}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faBriefcase} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">Cargo</span>
                                        <span className="info-value">{plano.cargo}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faUniversity} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">Banca</span>
                                        <span className="info-value">{plano.banca}</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faCalendar} className="info-icon" />
                                    <div className="info-content">
                                        <span className="info-label">Data da Prova</span>
                                        <span className="info-value">{plano.dataProva}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progresso Geral */}
                            <div className="plano-progresso-section">
                                <div className="progresso-header">
                                    <span className="progresso-label">Progresso Geral</span>
                                    <span className="progresso-percentual">{plano.progressoGeral}%</span>
                                </div>
                                <div className="progresso-barra-container">
                                    <div
                                        className="progresso-barra-preenchida"
                                        style={{ width: `${plano.progressoGeral}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Estatísticas do Plano */}
                            <div className="plano-estatisticas">
                                <div className="estatistica-item">
                                    <FontAwesomeIcon icon={faClock} className="estatistica-icon" />
                                    <div className="estatistica-content">
                                        <span className="estatistica-valor">{plano.horasEstudadas}h</span>
                                        <span className="estatistica-label">Horas Estudadas</span>
                                    </div>
                                </div>
                                <div className="estatistica-item">
                                    <FontAwesomeIcon icon={faBook} className="estatistica-icon" />
                                    <div className="estatistica-content">
                                        <span className="estatistica-valor">{plano.totalDisciplinas}</span>
                                        <span className="estatistica-label">Disciplinas</span>
                                    </div>
                                </div>
                                <div className="estatistica-item">
                                    <FontAwesomeIcon icon={faFire} className="estatistica-icon" />
                                    <div className="estatistica-content">
                                        <span className="estatistica-valor">{plano.constancia}%</span>
                                        <span className="estatistica-label">Constância</span>
                                    </div>
                                </div>
                                <div className="estatistica-item">
                                    <FontAwesomeIcon icon={faTachometerAlt} className="estatistica-icon" />
                                    <div className="estatistica-content">
                                        <span className="estatistica-valor">
                                            {plano.ritmoAtual > 0 ? `${plano.ritmoAtual}h/dia` : 'Pausado'}
                                        </span>
                                        <span className="estatistica-label">Ritmo Atual</span>
                                    </div>
                                </div>
                                <div className="estatistica-item">
                                    <FontAwesomeIcon icon={faBullseye} className="estatistica-icon" />
                                    <div className="estatistica-content">
                                        <span className="estatistica-valor">{plano.eficienciaGeral}%</span>
                                        <span className="estatistica-label">Eficiência</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rodapé do Card */}
                            <div className="plano-card-footer">
                                <span className="plano-data-criacao">
                                    Criado em {formatarData(plano.dataCriacao)}
                                </span>
                                <div className="plano-acoes">
                                    <button className="btn-plano-acao-secondary">
                                        <FontAwesomeIcon icon={faBook} />
                                        Ver Disciplinas
                                    </button>
                                    <button className="btn-plano-acao-secondary">
                                        <FontAwesomeIcon icon={faList} />
                                        Ver Sessões
                                    </button>
                                    <button className="btn-plano-acao-secondary">
                                        <FontAwesomeIcon icon={faCalendar} />
                                        Ver Planejamento
                                    </button>
                                    <button
                                        className="btn-plano-acao btn-plano-acao"
                                        onClick={() => handleEditarPlano(plano)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                        Editar
                                    </button>
                                    <button
                                        className="btn-plano-acao btn-plano-acao-danger"
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
                    message="Deseja realmente excluir?"
                    onConfirm={handleConfirmExclusao}
                    onCancel={handleCancelExclusao}
                />
            </div>
        </Layout>
    );
};

export default PlanosEstudo;
