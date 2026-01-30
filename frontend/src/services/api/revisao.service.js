import apiClient from './apiClient';

/**
 * Serviço de Revisões
 * Gerencia todas as operações relacionadas a revisões
 */
const revisaoService = {
    /**
     * Lista revisões de um plano de estudo
     */
    async getByPlanoId(planoId) {
        const response = await apiClient.get(`/revisao/planoEstudo/${planoId}`);
        return response.data;
    },

    /**
     * Lista revisões de uma disciplina
     */
    async getByDisciplinaId(disciplinaId) {
        const response = await apiClient.get(`/revisao/disciplina/${disciplinaId}`);
        return response.data;
    },

    /**
     * Obtém uma revisão por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/revisao/${id}`);
        return response.data;
    },

    /**
     * Cria uma nova revisão
     */
    async create(revisaoData) {
        const response = await apiClient.post('/revisao', revisaoData);
        return response.data;
    },

    /**
     * Atualiza uma revisão
     */
    async update(id, revisaoData) {
        const response = await apiClient.put(`/revisao/${id}`, revisaoData);
        return response.data;
    },

    /**
     * Deleta uma revisão
     */
    async delete(id) {
        const response = await apiClient.delete(`/revisao/${id}`);
        return response.data;
    },

    /**
     * Marca revisão como realizada
     */
    async marcarRealizada(id, dados) {
        const response = await apiClient.patch(`/revisao/${id}/realizar`, dados);
        return response.data;
    }
};

export default revisaoService;
