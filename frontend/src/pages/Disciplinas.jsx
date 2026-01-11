import { useState } from 'react';
import Layout from '../components/Layout/Layout';
import DisciplinaForm from '../components/DisciplinaForm';
import ConfirmDialog from '../components/ConfirmDialog';
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
    faStar
} from '@fortawesome/free-solid-svg-icons';
import './Disciplinas.css';

const Disciplinas = () => {
    // Estado para controle do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disciplinaParaEditar, setDisciplinaParaEditar] = useState(null);

    // Estado para controle do diálogo de confirmação
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [disciplinaParaExcluir, setDisciplinaParaExcluir] = useState(null);

    // Estado para o plano selecionado
    const [planoSelecionado, setPlanoSelecionado] = useState('1');

    // Dados mockados - Planos de Estudo
    const planos = [
        { id: '1', titulo: 'Plano Preparatório TRF 2024' },
        { id: '2', titulo: 'Preparação Concurso Polícia Federal' },
        { id: '3', titulo: 'Concurso Banco do Brasil 2024' },
        { id: '4', titulo: 'Plano TCU - Auditor Federal' }
    ];

    // Dados mockados - Disciplinas
    const [disciplinas, setDisciplinas] = useState([
        {
            id: 1,
            planoId: '1',
            nome: 'Direito Constitucional',
            peso: 4,
            nivelFamiliaridade: 4,
            horasEstudadas: 85,
            quantidadeTopicos: 45,
            questoesAcertadas: 78,
            questoesTotal: 100,
            topicosConcluidos: 32,
            topicosTotal: 45
        },
        {
            id: 2,
            planoId: '1',
            nome: 'Direito Administrativo',
            peso: 5,
            nivelFamiliaridade: 5,
            horasEstudadas: 92,
            quantidadeTopicos: 38,
            questoesAcertadas: 85,
            questoesTotal: 95,
            topicosConcluidos: 30,
            topicosTotal: 38
        },
        {
            id: 3,
            planoId: '1',
            nome: 'Língua Portuguesa',
            peso: 3,
            nivelFamiliaridade: 3,
            horasEstudadas: 65,
            quantidadeTopicos: 25,
            questoesAcertadas: 92,
            questoesTotal: 110,
            topicosConcluidos: 25,
            topicosTotal: 25
        },
        {
            id: 4,
            planoId: '1',
            nome: 'Raciocínio Lógico',
            peso: 3,
            nivelFamiliaridade: 2,
            horasEstudadas: 48,
            quantidadeTopicos: 20,
            questoesAcertadas: 55,
            questoesTotal: 80,
            topicosConcluidos: 12,
            topicosTotal: 20
        },
        {
            id: 5,
            planoId: '2',
            nome: 'Direito Penal',
            peso: 5,
            nivelFamiliaridade: 3,
            horasEstudadas: 78,
            quantidadeTopicos: 42,
            questoesAcertadas: 70,
            questoesTotal: 90,
            topicosConcluidos: 28,
            topicosTotal: 42
        }
    ]);

    const calcularDesempenho = (acertadas, total) => {
        if (total === 0) return 0;
        return Math.round((acertadas / total) * 100);
    };

    const calcularCobertura = (concluidos, total) => {
        if (total === 0) return 0;
        return Math.round((concluidos / total) * 100);
    };

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

    const handleSaveDisciplina = (disciplinaData) => {
        if (disciplinaParaEditar) {
            // Editar disciplina existente
            setDisciplinas(disciplinas.map(d => d.id === disciplinaData.id ? disciplinaData : d));
            console.log('Disciplina atualizada:', disciplinaData);
        } else {
            // Adicionar nova disciplina
            const novaDisciplina = {
                ...disciplinaData,
                id: Math.max(...disciplinas.map(d => d.id), 0) + 1,
                planoId: planoSelecionado,
                horasEstudadas: 0,
                quantidadeTopicos: 0,
                questoesAcertadas: 0,
                questoesTotal: 0,
                topicosConcluidos: 0,
                topicosTotal: 0
            };
            setDisciplinas([...disciplinas, novaDisciplina]);
            console.log('Nova disciplina criada:', novaDisciplina);
        }
        handleCloseModal();
    };

    const handleExcluirDisciplina = (disciplina) => {
        setDisciplinaParaExcluir(disciplina);
        setIsConfirmOpen(true);
    };

    const handleConfirmExclusao = () => {
        if (disciplinaParaExcluir) {
            setDisciplinas(disciplinas.filter(d => d.id !== disciplinaParaExcluir.id));
            console.log('Disciplina excluída:', disciplinaParaExcluir.nome);
        }
        setIsConfirmOpen(false);
        setDisciplinaParaExcluir(null);
    };

    const handleCancelExclusao = () => {
        setIsConfirmOpen(false);
        setDisciplinaParaExcluir(null);
    };

    // Filtrar disciplinas do plano selecionado
    const disciplinasFiltradas = disciplinas.filter(d => d.planoId === planoSelecionado);

    return (
        <Layout>
            <div className="disciplinas-container">
                <div className="disciplinas-header">
                    <div className="disciplinas-header-left">
                        <h2 className="disciplinas-title">Disciplinas</h2>
                        <div className="plano-selector">
                            <label htmlFor="planoSelect" className="plano-selector-label">
                                Plano de Estudo:
                            </label>
                            <select
                                id="planoSelect"
                                value={planoSelecionado}
                                onChange={(e) => setPlanoSelecionado(e.target.value)}
                                className="plano-select"
                            >
                                {planos.map(plano => (
                                    <option key={plano.id} value={plano.id}>
                                        {plano.titulo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="btn-nova-disciplina" onClick={handleNovaDisciplina}>
                        <FontAwesomeIcon icon={faPlus} />
                        Nova Disciplina
                    </button>
                </div>

                <div className="disciplinas-lista">
                    {disciplinasFiltradas.length === 0 ? (
                        <div className="disciplinas-vazio">
                            <p>Nenhuma disciplina cadastrada para este plano.</p>
                            <button className="btn-adicionar-primeira" onClick={handleNovaDisciplina}>
                                <FontAwesomeIcon icon={faPlus} />
                                Adicionar Primeira Disciplina
                            </button>
                        </div>
                    ) : (
                        disciplinasFiltradas.map((disciplina) => (
                            <div key={disciplina.id} className="disciplina-card">
                                {/* Cabeçalho do Card */}
                                <div className="disciplina-card-header">
                                    <h3 className="disciplina-nome">{disciplina.nome}</h3>
                                </div>

                                {/* Estatísticas da Disciplina */}
                                <div className="disciplina-estatisticas">
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faWeightHanging} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <span className="disciplina-stat-valor">{disciplina.peso}</span>
                                            <span className="disciplina-stat-label">Peso</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faStar} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <div className="disciplina-stat-stars">
                                                {[...Array(5)].map((_, index) => (
                                                    <FontAwesomeIcon
                                                        key={index}
                                                        icon={faStar}
                                                        className={`stat-star ${index < disciplina.nivelFamiliaridade ? 'filled' : 'empty'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="disciplina-stat-label">Familiaridade</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faClock} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <span className="disciplina-stat-valor">{disciplina.horasEstudadas}h</span>
                                            <span className="disciplina-stat-label">Horas Estudadas</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faListCheck} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <span className="disciplina-stat-valor">{disciplina.quantidadeTopicos}</span>
                                            <span className="disciplina-stat-label">Tópicos</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faBullseye} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <span className="disciplina-stat-valor">
                                                {calcularDesempenho(disciplina.questoesAcertadas, disciplina.questoesTotal)}%
                                            </span>
                                            <span className="disciplina-stat-label">Desempenho</span>
                                        </div>
                                    </div>
                                    <div className="disciplina-stat-item">
                                        <FontAwesomeIcon icon={faChartPie} className="disciplina-stat-icon" />
                                        <div className="disciplina-stat-content">
                                            <span className="disciplina-stat-valor">
                                                {calcularCobertura(disciplina.topicosConcluidos, disciplina.topicosTotal)}%
                                            </span>
                                            <span className="disciplina-stat-label">Cobertura</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rodapé do Card */}
                                <div className="disciplina-card-footer">
                                    <div className="disciplina-acoes">
                                        <button className="btn-disciplina-acao-secondary">
                                            <FontAwesomeIcon icon={faList} />
                                            Ver Tópicos
                                        </button>
                                        <button className="btn-disciplina-acao-secondary">
                                            <FontAwesomeIcon icon={faChartBar} />
                                            Ver Estatísticas
                                        </button>
                                        <button
                                            className="btn-disciplina-acao"
                                            onClick={() => handleEditarDisciplina(disciplina)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            Editar
                                        </button>
                                        <button
                                            className="btn-disciplina-acao btn-disciplina-acao-danger"
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
