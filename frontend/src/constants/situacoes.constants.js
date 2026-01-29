/**
 * Enums - Situações
 * Mapeamento dos estados/situações das entidades do sistema
 */

// ============================================
// SITUAÇÃO PLANO DE ESTUDO
// ============================================

export const SituacaoPlano = {
    NOVO: 'NOVO',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    CONCLUIDO: 'CONCLUIDO',
    EXCLUIDO: 'EXCLUIDO',
};

export const SituacaoPlanoLabels = {
    NOVO: 'Novo',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDO: 'Concluído',
    EXCLUIDO: 'Excluído',
};

export const SituacaoPlanoColors = {
    NOVO: '#3b82f6', // blue-500
    EM_ANDAMENTO: '#f59e0b', // amber-500
    CONCLUIDO: '#10b981', // emerald-500
    EXCLUIDO: '#6b7280', // gray-500
};

export const situacaoPlanoOptions = Object.entries(SituacaoPlanoLabels).map(([value, label]) => ({
    value,
    label,
    color: SituacaoPlanoColors[value],
}));

// ============================================
// SITUAÇÃO USUÁRIO
// ============================================

export const SituacaoUsuario = {
    ATIVO: 'ATIVO',
    BLOQUEADO: 'BLOQUEADO',
    INATIVO: 'INATIVO',
    EXCLUIDO: 'EXCLUIDO',
};

export const SituacaoUsuarioLabels = {
    ATIVO: 'Ativo',
    BLOQUEADO: 'Bloqueado',
    INATIVO: 'Inativo',
    EXCLUIDO: 'Excluído',
};

export const SituacaoUsuarioColors = {
    ATIVO: '#10b981', // emerald-500
    BLOQUEADO: '#ef4444', // red-500
    INATIVO: '#f59e0b', // amber-500
    EXCLUIDO: '#6b7280', // gray-500
};

export const situacaoUsuarioOptions = Object.entries(SituacaoUsuarioLabels).map(([value, label]) => ({
    value,
    label,
    color: SituacaoUsuarioColors[value],
}));

// ============================================
// SITUAÇÃO SESSÃO DE ESTUDO
// ============================================

export const SituacaoSessao = {
    AGENDADA: 'AGENDADA',
    CANCELADA: 'CANCELADA',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    PAUSADA: 'PAUSADA',
    CONCLUIDA: 'CONCLUIDA',
};

export const SituacaoSessaoLabels = {
    AGENDADA: 'Agendada',
    CANCELADA: 'Cancelada',
    EM_ANDAMENTO: 'Em Andamento',
    PAUSADA: 'Pausada',
    CONCLUIDA: 'Concluída',
};

export const SituacaoSessaoColors = {
    AGENDADA: '#3b82f6', // blue-500
    CANCELADA: '#ef4444', // red-500
    EM_ANDAMENTO: '#f59e0b', // amber-500
    PAUSADA: '#f97316', // orange-500
    CONCLUIDA: '#10b981', // emerald-500
};

export const situacaoSessaoOptions = Object.entries(SituacaoSessaoLabels).map(([value, label]) => ({
    value,
    label,
    color: SituacaoSessaoColors[value],
}));

// ============================================
// SITUAÇÃO REVISÃO
// ============================================

export const SituacaoRevisao = {
    AGENDADA: 'AGENDADA',
    IGNORADA: 'IGNORADA',
    CANCELADA: 'CANCELADA',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    PAUSADA: 'PAUSADA',
    CONCLUIDA: 'CONCLUIDA',
};

export const SituacaoRevisaoLabels = {
    AGENDADA: 'Agendada',
    IGNORADA: 'Ignorada',
    CANCELADA: 'Cancelada',
    EM_ANDAMENTO: 'Em Andamento',
    PAUSADA: 'Pausada',
    CONCLUIDA: 'Concluída',
};

export const SituacaoRevisaoColors = {
    AGENDADA: '#3b82f6', // blue-500
    IGNORADA: '#6b7280', // gray-500
    CANCELADA: '#ef4444', // red-500
    EM_ANDAMENTO: '#f59e0b', // amber-500
    PAUSADA: '#f97316', // orange-500
    CONCLUIDA: '#10b981', // emerald-500
};

export const situacaoRevisaoOptions = Object.entries(SituacaoRevisaoLabels).map(([value, label]) => ({
    value,
    label,
    color: SituacaoRevisaoColors[value],
}));
