/**
 * Constantes relacionadas à página de Planos de Estudo
 * Centraliza mensagens, configurações e valores reutilizáveis
 */

/** Mensagens de feedback para o usuário */
export const MESSAGES = {
    SUCCESS: {
        CREATE: 'Plano criado com sucesso!',
        UPDATE: 'Plano atualizado com sucesso!',
        DELETE: 'Plano excluído com sucesso!',
    },
    ERROR: {
        SAVE: 'Erro ao salvar plano de estudo',
        DELETE: 'Erro ao excluir plano de estudo',
    },
    LOADING: 'Carregando planos de estudo...',
    EMPTY: {
        NO_PLANS: 'Nenhum plano de estudo encontrado. Crie seu primeiro plano!',
        NO_RESULTS: 'Nenhum plano encontrado com os critérios de pesquisa.',
    },
    CONFIRM: {
        DELETE_TITLE: 'Confirmação de Exclusão',
        DELETE_MESSAGE: 'Esta ação irá excluir o plano de estudo e todas as disciplinas, tópicos, sessões, revisões e planejamentos associados. Deseja realmente excluir?',
    },
};

/** Configurações de busca */
export const SEARCH_CONFIG = {
    DEBOUNCE_DELAY: 300, // ms
    PLACEHOLDER: 'Pesquisar por título, concurso, cargo, banca ou data...',
};

/** Labels de acessibilidade */
export const ARIA_LABELS = {
    SEARCH_INPUT: 'Buscar planos de estudo',
    NEW_PLAN_BUTTON: 'Criar novo plano de estudo',
    LOADING_STATUS: 'Carregando planos de estudo',
    EMPTY_STATUS: 'Nenhum plano encontrado',
};
