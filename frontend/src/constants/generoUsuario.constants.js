/**
 * Enums - Gênero de Usuário
 * Mapeamento dos gêneros de usuário do backend
 */

export const GeneroUsuario = {
    FEMININO: 'FEMININO',
    MASCULINO: 'MASCULINO',
    OUTRO: 'OUTRO',
};

export const GeneroUsuarioLabels = {
    FEMININO: 'Feminino',
    MASCULINO: 'Masculino',
    OUTRO: 'Outro',
};

export const generoUsuarioOptions = Object.entries(GeneroUsuarioLabels).map(([value, label]) => ({
    id: value,
    descricao: label,
}));
