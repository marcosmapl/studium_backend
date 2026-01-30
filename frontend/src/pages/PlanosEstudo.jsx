import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import PlanoEstudoForm from '../components/PlanoEstudoForm';
import PlanoEstudoCard from '../components/PlanoEstudoCard';
import ConfirmDialog from '../components/ConfirmDialog';
import usePlanosEstudo from '../hooks/usePlanosEstudo';
import { usePlanoEstudoContext } from '../contexts/PlanoEstudoContext';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';
import { planoEstudoService } from '../services/api';
import { toast } from 'react-toastify';
import { formatDateToLocaleString } from '../utils/utils';
import { MESSAGES, SEARCH_CONFIG, ARIA_LABELS } from '../constants/planosEstudo.constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import './PlanosEstudo.css';

/**
 * Componente principal para gerenciamento de Planos de Estudo
 * 
 * Responsabilidades:
 * - Listagem de todos os planos do usuário
 * - Busca/filtro de planos por múltiplos critérios
 * - Criação, edição e exclusão de planos
 * - Navegação para páginas relacionadas (disciplinas)
 * 
 * @component
 */
const PlanosEstudo = () => {
    // ==================== HOOKS ====================

    /** Dados do usuário autenticado */
    const { usuario } = useAuth();

    /** Hook de navegação do React Router */
    const navigate = useNavigate();

    /** Hook customizado que carrega planos de estudo do backend */
    const { planos: planosEstudo, loading: loadingData, create, update, remove } = usePlanosEstudo(usuario?.id);

    /** Contexto global para recarregar planos na navbar */
    const { recarregarPlanos } = usePlanoEstudoContext();

    // ==================== ESTADO LOCAL ====================

    /** Controla visibilidade do modal de criação/edição */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** Armazena o plano sendo editado (null = modo criação) */
    const [planoParaEditar, setPlanoParaEditar] = useState(null);

    /** Controla visibilidade do diálogo de confirmação de exclusão */
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    /** Armazena o plano marcado para exclusão */
    const [planoParaExcluir, setPlanoParaExcluir] = useState(null);

    /** Termo de busca para filtrar planos */
    const [searchTerm, setSearchTerm] = useState('');

    /** Termo de busca com debounce aplicado (reduz re-renders durante digitação) */
    const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_CONFIG.DEBOUNCE_DELAY);

    // ==================== HANDLERS ====================

    /**
     * Abre modal em modo criação (sem plano selecionado)
     */
    const handleNovoPlano = useCallback(() => {
        setPlanoParaEditar(null);
        setIsModalOpen(true);
    }, []);

    /**
     * Abre modal em modo edição com plano selecionado
     * @param {Object} plano - Plano a ser editado
     */
    const handleEditarPlano = useCallback((plano) => {
        setPlanoParaEditar(plano);
        setIsModalOpen(true);
    }, []);

    /**
     * Fecha modal e limpa estado de edição
     */
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setPlanoParaEditar(null);
    }, []);

    /**
     * Salva plano (criação ou edição)
     * Realiza atualização otimista do estado local
     * 
     * @param {Object} planoData - Dados do plano a ser salvo
     */
    const handleSavePlano = useCallback(async (planoData) => {
        try {
            if (planoParaEditar) {
                // Modo edição: atualiza plano existente
                await update(planoData.id, planoData);
                toast.success(MESSAGES.SUCCESS.UPDATE);
            } else {
                // Modo criação: adiciona novo plano
                const novoPlanoData = {
                    ...planoData,
                    usuarioId: usuario.id,
                };
                await create(novoPlanoData);
                toast.success(MESSAGES.SUCCESS.CREATE);
            }
            // Recarrega planos no contexto global
            await recarregarPlanos();
        } catch (error) {
            toast.error(error.response?.data?.error || MESSAGES.ERROR.SAVE);
        }
    }, [planoParaEditar, usuario?.id, recarregarPlanos, create, update]);

    /**
     * Prepara exclusão de plano (abre diálogo de confirmação)
     * @param {Object} plano - Plano a ser excluído
     */
    const handleExcluirPlano = useCallback((plano) => {
        setPlanoParaExcluir(plano);
        setIsConfirmOpen(true);
    }, []);

    /**
     * Confirma e executa exclusão do plano
     * Remove plano do estado local após sucesso
     */
    const handleConfirmExclusao = useCallback(async () => {
        if (planoParaExcluir) {
            try {
                await remove(planoParaExcluir.id);
                toast.success(MESSAGES.SUCCESS.DELETE);
                // Recarrega planos no contexto global
                await recarregarPlanos();
            } catch (error) {
                toast.error(error.response?.data?.error || MESSAGES.ERROR.DELETE);
            }
        }
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    }, [planoParaExcluir, recarregarPlanos, remove]);

    /**
     * Cancela exclusão e fecha diálogo
     */
    const handleCancelExclusao = useCallback(() => {
        setIsConfirmOpen(false);
        setPlanoParaExcluir(null);
    }, []);

    /**
     * Navega para página de disciplinas do plano
     * @param {number} planoId - ID do plano
     */
    const handleVerDisciplinas = useCallback((planoId) => {
        navigate('/disciplinas', { state: { planoId } });
    }, [navigate]);

    // ==================== COMPUTED VALUES ====================

    /**
     * Filtra planos com base no termo de busca (com debounce)
     * Busca em: título, concurso, cargo, banca e data da prova
     * Memoizado para evitar recálculo desnecessário
     */
    const filteredPlanos = useMemo(() => {
        // Early return se não houver termo de busca
        if (!debouncedSearchTerm) return planosEstudo;

        const searchLower = debouncedSearchTerm.toLowerCase();

        return planosEstudo.filter((plano) => {
            // Cache da formatação de data
            const dataProvaFormatted = formatDateToLocaleString(plano.dataProva).toLowerCase();

            return (
                plano.titulo.toLowerCase().includes(searchLower) ||
                plano.concurso.toLowerCase().includes(searchLower) ||
                plano.cargo.toLowerCase().includes(searchLower) ||
                plano.banca.toLowerCase().includes(searchLower) ||
                dataProvaFormatted.includes(searchLower)
            );
        });
    }, [planosEstudo, debouncedSearchTerm]);

    return (
        <Layout>
            <div className="studium-container">
                <div className="studium-page-header planos-header">
                    <h2 className="studium-page-title">Planos de Estudo</h2>
                    <div className="planos-header-actions">
                        <div className="search-container">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" aria-hidden="true" />
                            <input
                                type="text"
                                placeholder={SEARCH_CONFIG.PLACEHOLDER}
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label={ARIA_LABELS.SEARCH_INPUT}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleNovoPlano}
                            aria-label={ARIA_LABELS.NEW_PLAN_BUTTON}
                        >
                            <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
                            Novo Plano
                        </button>
                    </div>
                </div>

                {loadingData ? (
                    <div className="loading-message" role="status" aria-live="polite">
                        {MESSAGES.LOADING}
                    </div>
                ) : planosEstudo.length === 0 ? (
                    <div className="planos-vazio" role="status">
                        <p>{MESSAGES.EMPTY.NO_PLANS}</p>
                    </div>
                ) : filteredPlanos.length === 0 ? (
                    <div className="planos-vazio" role="status">
                        <p>{MESSAGES.EMPTY.NO_RESULTS}</p>
                    </div>
                ) : (
                    <div className="planos-lista">
                        {filteredPlanos.map((plano) => (
                            <PlanoEstudoCard
                                key={plano.id}
                                plano={plano}
                                onEdit={handleEditarPlano}
                                onDelete={handleExcluirPlano}
                                onViewDisciplinas={handleVerDisciplinas}
                            />
                        ))}
                    </div>
                )}

                {/* Modal de Cadastro/Edição */}
                <PlanoEstudoForm
                    plano={planoParaEditar}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSavePlano}
                />

                {/* Diálogo de Confirmação de Exclusão */}
                <ConfirmDialog
                    isOpen={isConfirmOpen}
                    title={MESSAGES.CONFIRM.DELETE_TITLE}
                    message={MESSAGES.CONFIRM.DELETE_MESSAGE}
                    onConfirm={handleConfirmExclusao}
                    onCancel={handleCancelExclusao}
                />
            </div>
        </Layout>
    );
};

export default PlanosEstudo;
