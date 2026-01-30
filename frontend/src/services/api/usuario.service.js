import apiClient from './apiClient';

/**
 * Serviço de Usuários
 * Gerencia todas as operações relacionadas a usuários
 */
const usuarioService = {
    /**
     * Cria um novo usuário
     */
    async create(dadosUsuario) {
        const response = await apiClient.post('/usuario', dadosUsuario);
        return response.data;
    },

    /**
     * Obtém um usuário por ID
     */
    async getById(id) {
        const response = await apiClient.get(`/usuario/${id}`);
        return response.data;
    },

    /**
     * Atualiza um usuário
     */
    async update(id, dadosUsuario) {
        const response = await apiClient.put(`/usuario/${id}`, dadosUsuario);
        return response.data;
    },

    /**
     * Deleta um usuário
     */
    async delete(id) {
        const response = await apiClient.delete(`/usuario/${id}`);
        return response.data;
    },

    /**
     * Obtém informações do usuário autenticado
     */
    async getCurrentUser() {
        const response = await apiClient.get('/usuario/me');
        return response.data;
    },

    /**
     * Verifica disponibilidade de username ou email
     */
    async checkAvailability(params) {
        const response = await apiClient.get('/usuario/availability', {
            params,
        });
        return response.data;
    }
};

export default usuarioService;
