import apiClient from './apiClient';

/**
 * Serviço de Tópicos
 * Gerencia todas as operações relacionadas a tópicos
 */
const topicoService = {
    /**
     * Lista tópicos de uma disciplina
     */
    async getByDisciplinaId(disciplinaId) {
        const response = await apiClient.get(`/topico/disciplina/${disciplinaId}`);
        return response.data;
    },

    /**
     * Lista tópicos de um plano de estudo
     */
    async getByPlanoId(planoId) {
        const response = await apiClient.get(`/topico/planoEstudo/${planoId}`);
        return response.data;
    },

    /**
     * Obtém um tópico por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/topico/${id}`);
        return response.data;
    },

    /**
     * Cria um novo tópico
     */
    async create(topicoData) {
        const response = await apiClient.post('/topico', topicoData);
        return response.data;
    },

    /**
     * Atualiza um tópico
     */
    async update(id, topicoData) {
        const response = await apiClient.put(`/topico/${id}`, topicoData);
        return response.data;
    },

    /**
     * Deleta um tópico
     */
    async delete(id) {
        const response = await apiClient.delete(`/topico/${id}`);
        return response.data;
    },

    /**
     * Marca tópico como concluído/não concluído
     */
    async toggleConcluido(id, concluido) {
        const response = await apiClient.patch(`/topico/${id}`, { concluido });
        return response.data;
    }
};

export default topicoService;
