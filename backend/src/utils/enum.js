// ============================================
// ENUMS
// ============================================

const UnidadeFederativa = {
    AC: 'AC',
    AL: 'AL',
    AP: 'AP',
    AM: 'AM',
    BA: 'BA',
    CE: 'CE',
    DF: 'DF',
    ES: 'ES',
    GO: 'GO',
    MA: 'MA',
    MT: 'MT',
    MS: 'MS',
    MG: 'MG',
    PA: 'PA',
    PB: 'PB',
    PR: 'PR',
    PE: 'PE',
    PI: 'PI',
    RJ: 'RJ',
    RN: 'RN',
    RS: 'RS',
    RO: 'RO',
    RR: 'RR',
    SC: 'SC',
    SP: 'SP',
    SE: 'SE',
    TO: 'TO'
};

const GeneroUsuario = {
    FEMININO: 'FEMININO',
    MASCULINO: 'MASCULINO',
    OUTRO: 'OUTRO'
};

const SituacaoUsuario = {
    ATIVO: 'ATIVO',
    BLOQUEADO: 'BLOQUEADO',
    INATIVO: 'INATIVO',
    EXCLUIDO: 'EXCLUÍDO'
};

const CategoriaSessao = {
    TEORIA: 'TEORIA',
    REVISAO: 'REVISÃO',
    RESOLUCAO_QUESTOES: 'RESOLUÇÃO DE QUESTÕES',
    LEITURA: 'LEITURA',
    OUTROS: 'OUTROS'
};

const SituacaoSessao = {
    AGENDADA: 'AGENDADO',
    CANCELADA: 'CANCELADO',
    EM_ANDAMENTO: 'EM ANDAMENTO',
    PAUSADA: 'PAUSADO',
    CONCLUIDA: 'CONCLUÍDO'
};

const SituacaoRevisao = {
    AGENDADA: 'AGENDADO',
    IGNORADA: 'IGNORADO',
    CANCELADA: 'CANCELADO',
    EM_ANDAMENTO: 'EM ANDAMENTO',
    PAUSADA: 'PAUSADO',
    CONCLUIDA: 'CONCLUÍDO'
};

const SituacaoPlano = {
    NOVO: 'NOVO',
    EM_ANDAMENTO: 'EM ANDAMENTO',
    CONCLUIDO: 'CONCLUÍDO',
    EXCLUIDO: 'EXCLUIDO'
};

module.exports = {
    UnidadeFederativa,
    GeneroUsuario,
    SituacaoUsuario,
    CategoriaSessao,
    SituacaoSessao,
    SituacaoRevisao,
    SituacaoPlano
};
