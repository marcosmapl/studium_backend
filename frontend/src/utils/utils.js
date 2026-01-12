/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/AAAA)
 * @param {string} dataStr - String de data no formato ISO
 * @returns {string} Data formatada no padrão brasileiro
 */
export const formatDateToLocaleString = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/**
 * Calcula o total de horas estudadas a partir de sessões de estudo
 * @param {Array} sessoesEstudo - Array de sessões de estudo com tempoEstudo em decimal
 * @returns {string} Tempo total formatado como HH:MM
 */
export const calculateTotalHours = (sessoesEstudo) => {
    const totalTempoEstudo = sessoesEstudo.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.tempoEstudo;
    }, 0);

    const hours = Math.floor(totalTempoEstudo);
    const minutes = Math.round((totalTempoEstudo - hours) * 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
};


/**
 * Calcula o percentual de acerto com base no total de questões
 * @param {Array} sessoesEstudo - Array de sessões de estudo com questoesAcertos e questoesErros
 * @returns {string} Tempo total formatado como HH:MM
 */
export const calculatePerformance = (sessoesEstudo) => {
    const totalAcertos = sessoesEstudo.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.questoesAcertos;
    }, 0);
    const totalErros = sessoesEstudo.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.questoesErros;
    }, 0);

    const total = totalAcertos + totalErros;
    if (total === 0) return 0;

    return Math.round(totalAcertos / total * 100);
};

/**
 * Calcula o percentual de acerto com base no total de questões
 * @param {Array} topicos - Array de tópicos da disciplina com concluido (boolean)
 * @returns {float} Percentual de cobertura (tópicos concluídos) da disciplina
 */
export const calculateTopicCoverage = (topicos) => {
    if (topicos.length === 0) return 0;

    const totalConcluidos = topicos.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.concluido ? 1 : 0);
    }, 0);

    return Math.round((totalConcluidos / topicos.length) * 100);
};