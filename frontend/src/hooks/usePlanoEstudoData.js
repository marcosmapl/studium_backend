import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPlanosEstudoByUsuarioId } from '../services/api';

/**
 * Hook customizado para carregar dados iniciais do formulário de cadastro
 * 
 * @returns {Object} Objeto contendo:
 *   - loading: boolean indicando se está carregando
 *   - planos: array de gêneros disponíveis
 */
export const usePlanoEstudoData = (usuarioId) => {
    const [loading, setLoading] = useState(true);
    const [planosEstudo, setPlanosEstudo] = useState([]);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            try {
                // Executa todas as requisições em paralelo
                const [planosEstudoResponse] = await Promise.all([
                    getPlanosEstudoByUsuarioId(usuarioId),
                ]);

                // Atualiza estados com os dados recebidos
                if (planosEstudoResponse.data) {
                    setPlanosEstudo(planosEstudoResponse.data);
                }

            } catch (error) {
                toast.error('Erro ao carregar dados dos planos de estudo');
            } finally {
                setLoading(false);
            }
        };

        if (usuarioId) {
            carregarDadosIniciais();
        } else {
            setLoading(false);
        }
    }, [usuarioId]);

    return {
        loading,
        planosEstudo
    };
};
