import apiClient from './apiClient';

/**
 * Serviço para operações relacionadas a grupos de usuário
 */
const grupoUsuarioService = {
    /**
     * Retorna todos os grupos de usuário ordenados pelo backend
     */
    async listAll() {
        const response = await apiClient.get('/grupoUsuario');
        return response.data;
    }
};

export default grupoUsuarioService;
