import apiClient from './apiClient';

/**
 * Serviço de Sessões de Estudo
 * Gerencia todas as operações relacionadas a sessões de estudo
 */
const sessaoEstudoService = {
    /**
     * Lista sessões de estudo de um plano
     */
    async getByPlanoId(planoId) {
        const response = await apiClient.get(`/sessaoEstudo/planoEstudo/${planoId}`);
        return response.data;
    },

    /**
     * Lista sessões de estudo de uma disciplina
     */
    async getByDisciplinaId(disciplinaId) {
        const response = await apiClient.get(`/sessaoEstudo/disciplina/${disciplinaId}`);
        return response.data;
    },

    /**
     * Obtém uma sessão de estudo por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/sessaoEstudo/${id}`);
        return response.data;
    },

    /**
     * Cria uma nova sessão de estudo
     */
    async create(sessaoData) {
        const response = await apiClient.post('/sessaoEstudo', sessaoData);
        return response.data;
    },

    /**
     * Atualiza uma sessão de estudo
     */
    async update(id, sessaoData) {
        const response = await apiClient.put(`/sessaoEstudo/${id}`, sessaoData);
        return response.data;
    },

    /**
     * Deleta uma sessão de estudo
     */
    async delete(id) {
        const response = await apiClient.delete(`/sessaoEstudo/${id}`);
        return response.data;
    }
};

export default sessaoEstudoService;
