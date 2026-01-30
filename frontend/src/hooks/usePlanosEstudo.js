import { useState, useEffect, useCallback } from 'react';
import { planoEstudoService } from '../services/api';

/**
 * Hook para gerenciar planos de estudo de um usuário
 * 
 * @param {number} usuarioId - ID do usuário
 * @returns {Object} Estado e funções para gerenciar planos
 * 
 * @example
 * const { planos, loading, error, reload, create, update, remove } = usePlanos(userId);
 */
const usePlanosEstudo = (usuarioId) => {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Carrega planos do backend
     */
    const loadPlanos = useCallback(async () => {
        if (!usuarioId) {
            setPlanos([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await planoEstudoService.getByUsuarioId(usuarioId);
            setPlanos(data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [usuarioId]);

    /**
     * Cria novo plano
     */
    const create = useCallback(async (planoData) => {
        try {
            const novoPlano = await planoEstudoService.create(planoData);

            // Atualiza estado local
            setPlanos(prev => [...prev, novoPlano]);

            return novoPlano;
        } catch (err) {

            throw err;
        }
    }, [usuarioId]);

    /**
     * Atualiza plano existente
     */
    const update = useCallback(async (id, planoData) => {
        try {
            const planoAtualizado = await planoEstudoService.update(id, planoData);

            // Atualiza estado local
            setPlanos(prev =>
                prev.map(p => p.id === id ? planoAtualizado : p)
            );

            return planoAtualizado;
        } catch (err) {

            throw err;
        }
    }, []);

    /**
     * Remove plano
     */
    const remove = useCallback(async (id) => {
        try {
            await planoEstudoService.delete(id);

            // Remove do estado local
            setPlanos(prev => prev.filter(p => p.id !== id));
        } catch (err) {

            throw err;
        }
    }, []);

    /**
     * Recarrega planos
     */
    const reload = useCallback(() => {
        return loadPlanos();
    }, [loadPlanos]);

    // Carrega planos quando usuarioId muda
    useEffect(() => {
        loadPlanos();
    }, [loadPlanos]);

    return {
        planos,
        loading,
        error,
        reload,
        create,
        update,
        remove
    };
};

export default usePlanosEstudo;
