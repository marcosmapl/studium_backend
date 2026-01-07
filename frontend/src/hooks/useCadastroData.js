import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getGeneros, getUnidadesFederativas, getGruposUsuario, getSituacoesUsuario } from '../services/api';

/**
 * Hook customizado para carregar dados iniciais do formulário de cadastro
 * 
 * @returns {Object} Objeto contendo:
 *   - loading: boolean indicando se está carregando
 *   - generos: array de gêneros disponíveis
 *   - unidadesFederativas: array de UFs disponíveis
 *   - grupoBasicoId: ID do grupo "Básico" (null se não encontrado)
 *   - situacaoAtivoId: ID da situação "Ativo" (null se não encontrado)
 */
export const useCadastroData = () => {
    const [loading, setLoading] = useState(true);
    const [generos, setGeneros] = useState([]);
    const [unidadesFederativas, setUnidadesFederativas] = useState([]);
    const [grupoBasicoId, setGrupoBasicoId] = useState(null);
    const [situacaoAtivoId, setSituacaoAtivoId] = useState(null);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            try {
                // Executa todas as requisições em paralelo
                const [generosResponse, unidadesResponse, gruposResponse, situacoesResponse] = await Promise.all([
                    getGeneros(),
                    getUnidadesFederativas(),
                    getGruposUsuario(),
                    getSituacoesUsuario()
                ]);

                // Log para debug (remover em produção)
                console.log('Gêneros:', generosResponse.data);
                console.log('Unidades Federativas:', unidadesResponse.data);
                console.log('Grupos:', gruposResponse.data);
                console.log('Situações:', situacoesResponse.data);

                // Atualiza estados com os dados recebidos
                if (generosResponse.data) {
                    setGeneros(generosResponse.data);
                }

                if (unidadesResponse.data) {
                    setUnidadesFederativas(unidadesResponse.data);
                }

                // Buscar automaticamente o grupo "Básico"
                if (gruposResponse.data) {
                    const grupoBasico = gruposResponse.data.find(g => g.descricao === 'Básico');
                    if (grupoBasico) {
                        setGrupoBasicoId(grupoBasico.id);
                        console.log('Grupo Básico ID:', grupoBasico.id);
                    } else {
                        console.error('Grupo "Básico" não encontrado');
                        toast.error('Erro: Grupo de usuário "Básico" não configurado');
                    }
                }

                // Buscar automaticamente a situação "Ativo"
                if (situacoesResponse.data) {
                    const situacaoAtivo = situacoesResponse.data.find(s => s.descricao === 'Ativo');
                    if (situacaoAtivo) {
                        setSituacaoAtivoId(situacaoAtivo.id);
                        console.log('Situação Ativo ID:', situacaoAtivo.id);
                    } else {
                        console.error('Situação "Ativo" não encontrada');
                        toast.error('Erro: Situação de usuário "Ativo" não configurada');
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
                console.error('Detalhes do erro:', error.response);
                toast.error('Erro ao carregar dados do formulário');
            } finally {
                setLoading(false);
            }
        };

        carregarDadosIniciais();
    }, []); // Array vazio = executa apenas uma vez no mount

    return {
        loading,
        generos,
        unidadesFederativas,
        grupoBasicoId,
        situacaoAtivoId
    };
};
