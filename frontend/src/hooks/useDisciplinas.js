import { useState, useEffect, useCallback } from 'react';
import { disciplinaService } from '../services/api';
import logger from '../utils/logger';

/**
 * Hook para gerenciar disciplinas de um plano de estudo
 * 
 * @param {number} planoId - ID do plano de estudo
 * @returns {Object} Estado e funções para gerenciar disciplinas
 * 
 * @example
 * const { 
 *   disciplinas, 
 *   loading, 
 *   error, 
 *   reload, 
 *   create, 
 *   update, 
 *   remove,
 *   toggleSelecionada 
 * } = useDisciplinas(planoId);
 */
const useDisciplinas = (planoId) => {
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Carrega disciplinas do backend
     */
    const loadDisciplinas = useCallback(async () => {
        if (!planoId) {
            setDisciplinas([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            logger.debug('Carregando disciplinas', { planoId });
            const data = await disciplinaService.getByPlanoId(planoId);
            setDisciplinas(data || []);
            logger.info('Disciplinas carregadas', {
                planoId,
                count: data?.length || 0
            });
        } catch (err) {
            setError(err);
            logger.error('Erro ao carregar disciplinas', {
                planoId,
                error: err.message
            });
        } finally {
            setLoading(false);
        }
    }, [planoId]);

    /**
     * Cria nova disciplina
     */
    const create = useCallback(async (disciplinaData) => {
        try {
            logger.info('Criando nova disciplina', { planoId });
            const novaDisciplina = await disciplinaService.create({
                ...disciplinaData,
                planoEstudoId: planoId
            });

            setDisciplinas(prev => [...prev, novaDisciplina]);

            logger.info('Disciplina criada com sucesso', {
                disciplinaId: novaDisciplina.id,
                planoId
            });

            return novaDisciplina;
        } catch (err) {
            logger.error('Erro ao criar disciplina', {
                planoId,
                error: err.message
            });
            throw err;
        }
    }, [planoId]);

    /**
     * Atualiza disciplina existente
     */
    const update = useCallback(async (id, disciplinaData) => {
        try {
            logger.info('Atualizando disciplina', { disciplinaId: id });
            const disciplinaAtualizada = await disciplinaService.update(id, disciplinaData);

            setDisciplinas(prev =>
                prev.map(d => d.id === id ? disciplinaAtualizada : d)
            );

            logger.info('Disciplina atualizada com sucesso', { disciplinaId: id });

            return disciplinaAtualizada;
        } catch (err) {
            logger.error('Erro ao atualizar disciplina', {
                disciplinaId: id,
                error: err.message
            });
            throw err;
        }
    }, []);

    /**
     * Remove disciplina
     */
    const remove = useCallback(async (id) => {
        try {
            logger.info('Removendo disciplina', { disciplinaId: id });
            await disciplinaService.delete(id);

            setDisciplinas(prev => prev.filter(d => d.id !== id));

            logger.info('Disciplina removida com sucesso', { disciplinaId: id });
        } catch (err) {
            logger.error('Erro ao remover disciplina', {
                disciplinaId: id,
                error: err.message
            });
            throw err;
        }
    }, []);

    /**
     * Marca/desmarca disciplina como selecionada
     */
    const toggleSelecionada = useCallback(async (id) => {
        try {
            const disciplina = disciplinas.find(d => d.id === id);
            if (!disciplina) return;

            const novoValor = !disciplina.selecionada;

            logger.info('Alterando seleção de disciplina', {
                disciplinaId: id,
                selecionada: novoValor
            });

            // Atualização otimista
            setDisciplinas(prev =>
                prev.map(d =>
                    d.id === id ? { ...d, selecionada: novoValor } : d
                )
            );

            await disciplinaService.toggleSelecionada(id, novoValor);

            logger.info('Seleção alterada com sucesso', {
                disciplinaId: id,
                selecionada: novoValor
            });
        } catch (err) {
            logger.error('Erro ao alterar seleção', {
                disciplinaId: id,
                error: err.message
            });
            // Reverte mudança otimista
            loadDisciplinas();
            throw err;
        }
    }, [disciplinas, loadDisciplinas]);

    /**
     * Recarrega disciplinas
     */
    const reload = useCallback(() => {
        return loadDisciplinas();
    }, [loadDisciplinas]);

    // Carrega disciplinas quando planoId muda
    useEffect(() => {
        loadDisciplinas();
    }, [loadDisciplinas]);

    return {
        disciplinas,
        loading,
        error,
        reload,
        create,
        update,
        remove,
        toggleSelecionada
    };
};

export default useDisciplinas;
