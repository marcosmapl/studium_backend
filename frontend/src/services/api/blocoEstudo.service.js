import apiClient from './apiClient';

/**
 * Serviço de Blocos de Estudo
 * Gerencia todas as operações relacionadas a blocos de estudo
 */
const blocoEstudoService = {
    /**
     * Lista blocos de um plano de estudo
     */
    async getByPlanoId(planoEstudoId) {
        const response = await apiClient.get(`/blocoEstudo`, {
            params: { planoEstudoId }
        });
        return response.data;
    },

    /**
     * Lista blocos de um plano e disciplina específicos
     */
    async getByPlanoAndDisciplina(planoEstudoId, disciplinaId) {
        const response = await apiClient.get(`/blocoEstudo/plano/${planoEstudoId}/disciplina/${disciplinaId}`);
        return response.data;
    },

    /**
     * Obtém um bloco por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/blocoEstudo/${id}`);
        return response.data;
    },

    /**
     * Cria um novo bloco de estudo
     */
    async create(blocoData) {
        const response = await apiClient.post('/blocoEstudo', blocoData);
        return response.data;
    },

    /**
     * Atualiza um bloco de estudo
     */
    async update(id, blocoData) {
        const response = await apiClient.put(`/blocoEstudo/${id}`, blocoData);
        return response.data;
    },

    /**
     * Deleta um bloco de estudo
     */
    async delete(id) {
        const response = await apiClient.delete(`/blocoEstudo/${id}`);
        return response.data;
    }
};

export default blocoEstudoService;
