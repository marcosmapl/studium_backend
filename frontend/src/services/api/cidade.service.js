import apiClient from './apiClient';

/**
 * Serviço de Cidades e Localização
 * Gerencia operações relacionadas a cidades e localização
 */
const cidadeService = {
    /**
     * Lista todas as cidades
     */
    async getAll() {
        const response = await apiClient.get('/cidade');
        return response.data;
    },

    /**
     * Lista cidades de uma UF
     */
    async getByUF(ufId) {
        const response = await apiClient.get(`/cidade/uf/${ufId}`);
        return response.data;
    },

    /**
     * Obtém uma cidade por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/cidade/${id}`);
        return response.data;
    }
};

export default cidadeService;
