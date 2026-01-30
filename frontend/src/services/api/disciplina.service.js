import apiClient from './apiClient';

/**
 * Serviço de Disciplinas
 * Gerencia todas as operações relacionadas a disciplinas
 */
const disciplinaService = {
    /**
     * Lista disciplinas de um plano de estudo
     */
    async getByPlanoId(planoId) {
        const response = await apiClient.get(`/disciplina/plano/${planoId}`);
        return response.data;
    },

    /**
     * Obtém uma disciplina por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/disciplina/${id}`);
        return response.data;
    },

    /**
     * Cria uma nova disciplina
     */
    async create(disciplinaData) {
        const response = await apiClient.post('/disciplina', disciplinaData);
        return response.data;
    },

    /**
     * Atualiza uma disciplina
     */
    async update(id, disciplinaData) {
        const response = await apiClient.put(`/disciplina/${id}`, disciplinaData);
        return response.data;
    },

    /**
     * Deleta uma disciplina
     */
    async delete(id) {
        const response = await apiClient.delete(`/disciplina/${id}`);
        return response.data;
    },

    /**
     * Marca/desmarca disciplina como selecionada
     */
    async toggleSelecionada(id, selecionada) {
        const response = await apiClient.patch(`/disciplina/${id}`, { selecionada });
        return response.data;
    }
};

export default disciplinaService;
