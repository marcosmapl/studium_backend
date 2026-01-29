import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faList,
    faClock,
    faChartLine,
    faCalendarAlt,
    faBook,
    faSync,
    faPlus,
    faGripVertical,
    faListCheck,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { getTopicosByDisciplinaId, createTopico, updateTopico, deleteTopico } from '../services/api';
import { formatDateToLocaleString, getMostRecentEstudoDate, getNextRevisaoDate, calculateTotalHours, calculatePerformance } from '../utils/utils';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import './TopicosModal.css';

const TopicosModal = ({ isOpen, onClose, disciplina }) => {

    const [topicos, setTopicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [novoTopicoTitulo, setNovoTopicoTitulo] = useState('');
    const [criandoTopico, setCriandoTopico] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedOverItem, setDraggedOverItem] = useState(null);
    const [editandoTopicoId, setEditandoTopicoId] = useState(null);
    const [tituloEditado, setTituloEditado] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [topicoParaExcluir, setTopicoParaExcluir] = useState(null);

    useEffect(() => {
        if (isOpen && disciplina) {
            carregarTopicos();
            setNovoTopicoTitulo('');
        }
    }, [isOpen, disciplina]);

    const carregarTopicos = async () => {
        if (!disciplina?.id) return;

        setLoading(true);
        try {
            const response = await getTopicosByDisciplinaId(disciplina.id);
            setTopicos(response.data || []);
        } catch (error) {
            setTopicos([]);
            toast.error('Erro ao carregar tópicos');
        } finally {
            setLoading(false);
        }
    };

    const handleCriarTopico = async (e) => {
        e.preventDefault();

        if (!novoTopicoTitulo.trim()) {
            toast.warning('Por favor, informe o título do tópico');
            return;
        }

        if (!disciplina?.id) {
            toast.error('Disciplina não identificada');
            return;
        }

        setCriandoTopico(true);
        try {
            // Calcula a próxima ordem
            const proximaOrdem = topicos.length > 0
                ? Math.max(...topicos.map(t => t.ordem)) + 1
                : 1;

            const novoTopico = {
                titulo: novoTopicoTitulo.trim(),
                ordem: proximaOrdem,
                disciplinaId: disciplina.id
            };

            const response = await createTopico(novoTopico);

            // Adiciona o novo tópico à lista
            setTopicos([...topicos, response.data]);
            setNovoTopicoTitulo('');
            toast.success('Tópico criado com sucesso!');
            //TODO: atualizar a lista de disciplina para refletir o novo tópico 

        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao criar tópico');
        } finally {
            setCriandoTopico(false);
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedItem !== index) {
            setDraggedOverItem(index);
        }
    };

    const handleDragLeave = () => {
        setDraggedOverItem(null);
    };

    const atualizarOrdemTopicos = async (topicos) => {
        try {
            // Atualiza as ordens
            const topicosAtualizados = topicos.map((topico, index) => ({
                ...topico,
                ordem: index + 1
            }));
            
            // Atualiza as ordens no backend
            await Promise.all(
                topicosAtualizados.map(topico =>
                    updateTopico(topico.id, { ordem: topico.ordem })
                )
            );
            toast.success('Ordem dos tópicos atualizada!');
            setTopicos(topicosAtualizados);

        } catch (error) {
            toast.error('Erro ao salvar a nova ordem');
            // Recarrega os tópicos em caso de erro
            carregarTopicos();
        }
    }

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();

        if (draggedItem === null || draggedItem === dropIndex) {
            setDraggedItem(null);
            setDraggedOverItem(null);
            return;
        }

        const newTopicos = [...topicos];
        const draggedTopico = newTopicos[draggedItem];

        // Remove o item da posição original
        newTopicos.splice(draggedItem, 1);

        // Insere na nova posição
        newTopicos.splice(dropIndex, 0, draggedTopico);

        // Atualiza as ordens
        atualizarOrdemTopicos(newTopicos);

        setDraggedItem(null);
        setDraggedOverItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDraggedOverItem(null);
    };

    const handleIniciarEdicao = (topico) => {
        setEditandoTopicoId(topico.id);
        setTituloEditado(topico.titulo);
    };

    const handleSalvarEdicao = async (topicoId) => {
        if (!tituloEditado.trim()) {
            toast.warning('O título não pode estar vazio');
            setEditandoTopicoId(null);
            setTituloEditado('');
            return;
        }

        if (tituloEditado.trim() === topicos.find(t => t.id === topicoId)?.titulo) {
            setEditandoTopicoId(null);
            setTituloEditado('');
            return;
        }

        try {
            await updateTopico(topicoId, { titulo: tituloEditado.trim() });

            setTopicos(topicos.map(t =>
                t.id === topicoId ? { ...t, titulo: tituloEditado.trim() } : t
            ));

            toast.success('Tópico atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar tópico');
        } finally {
            setEditandoTopicoId(null);
            setTituloEditado('');
        }
    };

    const handleExcluirTopico = async (topico) => {
        setTopicoParaExcluir(topico);
        setConfirmDialogOpen(true);
    };

    const handleConfirmarExclusao = async () => {
        if (!topicoParaExcluir) return;

        try {
            await deleteTopico(topicoParaExcluir.id);
            const updatedTopicos = topicos.filter(t => t.id !== topicoParaExcluir.id);
            // Atualiza as ordens
            atualizarOrdemTopicos(updatedTopicos);
            toast.success('Tópico excluído com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir tópico');
        } finally {
            setConfirmDialogOpen(false);
            setTopicoParaExcluir(null);
        }
    };

    const handleCancelarExclusao = () => {
        setConfirmDialogOpen(false);
        setTopicoParaExcluir(null);
    };

    const handleToggleEdital = async (topicoId, valorAtual) => {
        try {
            const novoValor = !valorAtual;
            await updateTopico(topicoId, { edital: novoValor });

            setTopicos(topicos.map(t =>
                t.id === topicoId ? { ...t, edital: novoValor } : t
            ));

            toast.success(`Tópico ${novoValor ? 'marcado como' : 'desmarcado do'} edital`);
        } catch (error) {
            toast.error('Erro ao atualizar tópico');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container topicos-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Cabeçalho */}
                <div className="studium-modal-header">
                    <FontAwesomeIcon icon={faList} />
                    <h2 className="studium-modal-title">
                        Tópicos - {disciplina?.titulo}
                    </h2>
                    <button className="studium-modal-close-btn" onClick={onClose} aria-label="Fechar">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="topicos-modal-body">
                    {/* Formulário de Novo Tópico */}
                    <div className="topico-novo-form">
                        <form onSubmit={handleCriarTopico} className="topico-novo-form-content">
                            <input
                                type="text"
                                className="topico-novo-input"
                                placeholder="Digite o título do novo tópico..."
                                value={novoTopicoTitulo}
                                onChange={(e) => setNovoTopicoTitulo(e.target.value)}
                                disabled={criandoTopico}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary topico-novo-btn"
                                disabled={criandoTopico || !novoTopicoTitulo.trim()}
                            >
                                <FontAwesomeIcon icon={criandoTopico ? faSync : faPlus} spin={criandoTopico} />
                                {criandoTopico ? 'Criando...' : 'Adicionar Tópico'}
                            </button>
                        </form>
                    </div>

                    {loading ? (
                        <div className="topicos-modal-loading">
                            <FontAwesomeIcon icon={faSync} spin />
                            <p>Carregando tópicos...</p>
                        </div>
                    ) : topicos.length === 0 ? (
                        <div className="topicos-modal-vazio">
                            <FontAwesomeIcon icon={faList} className="topicos-modal-vazio-icon" />
                            <p>Nenhum tópico cadastrado para esta disciplina.</p>
                        </div>
                    ) : (
                        <>
                            {/* Cabeçalho das Colunas */}
                            <div className="topicos-lista-header">
                                <div className="topicos-header-drag"></div>
                                <div className="topicos-header-titulo">Tópico</div>
                                <div className="topicos-header-stats">
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faClock} />
                                        Tempo
                                    </div>
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faChartLine} />
                                        Desempenho
                                    </div>
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faBook} />
                                        Estudos
                                    </div>
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        Último
                                    </div>
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        Próxima
                                    </div>
                                    <div className="topicos-header-stat">
                                        <FontAwesomeIcon icon={faListCheck} />
                                        Edital
                                    </div>
                                    <div className="topicos-header-stat">
                                        Ações
                                    </div>
                                </div>
                            </div>

                            <div className="topicos-lista">
                                {topicos.map((topico, index) => {
                                    const tempoTotal = calculateTotalHours(topico.sessoesEstudo || []);
                                    const percentualAcerto = calculatePerformance(topico.sessoesEstudo || []);
                                    const dataUltimoEstudo = getMostRecentEstudoDate(topico.sessoesEstudo || []);
                                    const dataProximaRevisao = getNextRevisaoDate(topico.revisoes || []);
                                    const vezesEstudado = topico.sessoesEstudo.length || 0;

                                    return (
                                        <div
                                            key={topico.id}
                                            className={`topico-card ${topico.concluido ? 'topico-concluido' : ''}${draggedItem === index ? ' dragging' : ''}${draggedOverItem === index ? ' drag-over' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            {/* Indicador de Arrasto */}
                                            <div className="topico-drag-handle">
                                                <FontAwesomeIcon icon={faGripVertical} />
                                            </div>

                                            {/* Cabeçalho do Card */}
                                            <div className="topico-card-header">
                                                <div className="topico-card-titulo">
                                                    <span className="topico-ordem">#{topico.ordem}</span>
                                                    {editandoTopicoId === topico.id ? (
                                                        <input
                                                            type="text"
                                                            className="topico-titulo-input"
                                                            value={tituloEditado}
                                                            onChange={(e) => setTituloEditado(e.target.value)}
                                                            onBlur={() => handleSalvarEdicao(topico.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSalvarEdicao(topico.id);
                                                                } else if (e.key === 'Escape') {
                                                                    setEditandoTopicoId(null);
                                                                    setTituloEditado('');
                                                                }
                                                            }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <h3
                                                            className={`topico-nome ${topico.edital ? '' : 'disabled'} topico-nome-editavel`}
                                                            onClick={() => handleIniciarEdicao(topico)}
                                                            title="Clique para editar"
                                                        >
                                                            {topico.titulo}
                                                        </h3>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Estatísticas */}
                                            <div className="topico-stats-grid">
                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'}`}>
                                                            {`${tempoTotal}`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'}`}>
                                                            {`${percentualAcerto}%`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'}`}>
                                                            {`${vezesEstudado}x`}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'} topico-stat-valor-small`}>
                                                            {dataUltimoEstudo
                                                                ? formatDateToLocaleString(dataUltimoEstudo)
                                                                : '__/__/____'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'} topico-stat-valor-small`}>
                                                            {dataProximaRevisao
                                                                ? formatDateToLocaleString(dataProximaRevisao)
                                                                : '__/__/____'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-content">
                                                        <span className={`topico-stat-valor ${topico.edital ? '' : 'disabled'} topico-stat-valor-small`}>
                                                            <input 
                                                                type="checkbox" 
                                                                name={`checkbox-${topico.id}`} 
                                                                checked={topico.edital || false}
                                                                onChange={() => handleToggleEdital(topico.id, topico.edital)}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="topico-stat-item">
                                                    <div className="topico-stat-actions">
                                                        <button
                                                            className="btn btn-danger btn-xs"
                                                            onClick={() => handleExcluirTopico(topico)}
                                                            title="Excluir tópico"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Rodapé */}
                <div className="topicos-modal-footer">
                </div>
            </div>

            {/* Diálogo de Confirmação */}
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                title="Excluir Tópico"
                message={`Tem certeza que deseja excluir o tópico "${topicoParaExcluir?.titulo}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleConfirmarExclusao}
                onCancel={handleCancelarExclusao}
            />
        </div>
    );
};

TopicosModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    disciplina: PropTypes.object
};

export default TopicosModal;
