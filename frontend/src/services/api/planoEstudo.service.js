import apiClient from './apiClient';

/**
 * Serviço de Planos de Estudo
 * Gerencia todas as operações relacionadas a planos de estudo
 */
const planoEstudoService = {
    /**
     * Lista todos os planos de estudo de um usuário
     */
    async getByUsuarioId(usuarioId) {
        const response = await apiClient.get(`/planoEstudo/usuario/${usuarioId}`);
        return response.data;
    },

    /**
     * Obtém um plano de estudo por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/planoEstudo/${id}`);
        return response.data;
    },

    /**
     * Cria um novo plano de estudo
     */
    async create(planoData) {
        const response = await apiClient.post('/planoEstudo', planoData);
        return response.data;
    },

    /**
     * Atualiza um plano de estudo
     */
    async update(id, planoData) {
        const response = await apiClient.put(`/planoEstudo/${id}`, planoData);
        return response.data;
    },

    /**
     * Deleta um plano de estudo
     */
    async delete(id) {
        const response = await apiClient.delete(`/planoEstudo/${id}`);
        return response.data;
    },

    /**
     * Obtém situações disponíveis para planos
     */
    async getSituacoes() {
        const response = await apiClient.get('/situacaoPlano');
        return response.data;
    }
};

export default planoEstudoService;
