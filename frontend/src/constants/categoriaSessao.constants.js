/**
 * Enums - Categoria de Sessão de Estudo
 * Mapeamento das categorias de sessão do backend
 */

export const CategoriaSessao = {
    TEORIA: 'TEORIA',
    REVISAO: 'REVISAO',
    RESOLUCAO_QUESTOES: 'RESOLUCAO_QUESTOES',
    LEITURA: 'LEITURA',
    OUTROS: 'OUTROS',
};

export const CategoriaSessaoLabels = {
    TEORIA: 'Teoria',
    REVISAO: 'Revisão',
    RESOLUCAO_QUESTOES: 'Resolução de Questões',
    LEITURA: 'Leitura',
    OUTROS: 'Outros',
};

export const CategoriaSessaoColors = {
    TEORIA: '#3b82f6', // blue-500
    REVISAO: '#8b5cf6', // violet-500
    RESOLUCAO_QUESTOES: '#f59e0b', // amber-500
    LEITURA: '#06b6d4', // cyan-500
    OUTROS: '#6b7280', // gray-500
};

export const CategoriaSessaoIcons = {
    TEORIA: 'faBook',
    REVISAO: 'faRotate',
    RESOLUCAO_QUESTOES: 'faListCheck',
    LEITURA: 'faBookOpen',
    OUTROS: 'faEllipsis',
};

export const categoriaSessaoOptions = Object.entries(CategoriaSessaoLabels).map(([value, label]) => ({
    value,
    label,
    color: CategoriaSessaoColors[value],
    icon: CategoriaSessaoIcons[value],
}));
