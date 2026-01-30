import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    generoUsuarioOptions,
    unidadesFederativasOptions,
    SituacaoUsuario
} from '../constants';
import { grupoUsuarioService } from '../services/api';

/**
 * Hook customizado para carregar dados iniciais do formulário de cadastro
 * 
 * @returns {Object} Objeto contendo:
 *   - loading: boolean indicando se está carregando
 *   - generos: array de gêneros disponíveis
 *   - unidadesFederativas: array de UFs disponíveis
 *   - grupoGratuitoId: ID do grupo de usuário "Gratuito"
 *   - situacaoAtivoId: valor enum da situação "Ativo"
 */
export const useCadastroData = () => {
    const [loading, setLoading] = useState(true);
    const [generos, setGeneros] = useState([]);
    const [unidadesFederativasData, setUnidadesFederativasData] = useState([]);
    const [situacaoAtivoId, setSituacaoAtivoId] = useState(null);
    const [grupoGratuitoId, setGrupoGratuitoId] = useState(null);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);

            try {
                // Usa constantes existentes em vez de buscar do backend
                setGeneros(generoUsuarioOptions);
                setUnidadesFederativasData(unidadesFederativasOptions);

                // Define situação "Ativo"
                setSituacaoAtivoId(SituacaoUsuario.ATIVO);

                // Busca grupo padrão "Gratuito" no backend para garantir ID correto
                const normalizar = (valor) =>
                    valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                const grupos = await grupoUsuarioService.listAll();
                const nomesPadrao = ['gratuito', 'usuario', 'basico'];
                const grupoPadrao = grupos?.find((grupo) => {
                    if (typeof grupo.descricao !== 'string') {
                        return false;
                    }

                    const descricaoNormalizada = normalizar(grupo.descricao.trim());
                    return nomesPadrao.includes(descricaoNormalizada);
                });

                if (grupoPadrao?.id) {
                    setGrupoGratuitoId(grupoPadrao.id);
                } else {
                    toast.error('Grupo de usuário padrão não encontrado. Contate o administrador.');
                    setGrupoGratuitoId(null);
                }
            } catch (error) {
                toast.error('Erro ao carregar dados do formulário');
                setGrupoGratuitoId(null);
            } finally {
                setLoading(false);
            }
        };

        carregarDadosIniciais();
    }, []); // Array vazio = executa apenas uma vez no mount

    return {
        loading,
        generos,
        unidadesFederativas: unidadesFederativasData,
        grupoGratuitoId,
        situacaoAtivoId
    };
};
