/**
 * Opções de dias da semana com ID, label e sigla
 */
export const diasSemanaOptions = [
    { id: 0, label: 'Domingo', sigla: 'DOM' },
    { id: 1, label: 'Segunda-feira', sigla: 'SEG' },
    { id: 2, label: 'Terça-feira', sigla: 'TER' },
    { id: 3, label: 'Quarta-feira', sigla: 'QUA' },
    { id: 4, label: 'Quinta-feira', sigla: 'QUI' },
    { id: 5, label: 'Sexta-feira', sigla: 'SEX' },
    { id: 6, label: 'Sábado', sigla: 'SÁB' }
];

/**
 * Formata uma data ISO para o formato brasileiro (DD/MM/AAAA)
 * @param {string} dateString - String de data no formato ISO
 * @returns {string} Data formatada no padrão brasileiro
 */
export const formatDateToLocaleString = (dateString) => {
    const data = new Date(dateString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};


/**
 * Formata uma data ISO para o formato do input (YYYY-MM-DD)
 * @param {*} dateString  - String de data no formato ISO
 * @returns {string} Data formatada no padrão brasileiro
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


/**
 * 
 * @param {Array} sessoesEstudo 
 * @returns 
 */
export const getMostRecentEstudoDate = (sessoesEstudo) => {
    if (!sessoesEstudo || sessoesEstudo.length === 0) return null;

    const sessoesOrdenadas = [...sessoesEstudo].sort((a, b) =>
        new Date(b.dataTermino) - new Date(a.dataTermino)
    );

    return sessoesOrdenadas[0]?.dataTermino;
};

/**
 * 
 * @param {Array} revisoes 
 * @returns 
 */
export const getNextRevisaoDate = (revisoes) => {
    if (!revisoes || revisoes.length === 0) return null;

    const revisoesAgendadas = revisoes
        .filter(revisao => !revisao.dataRealizada)
        .sort((a, b) => new Date(a.dataProgramada) - new Date(b.dataProgramada));

    return revisoesAgendadas[0]?.dataProgramada;
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

/**
 * Converte horas decimais para formato HH:MM
 * @param {number} horas - Horas em formato decimal (ex: 2.5)
 * @returns {string} Horas formatadas como HH:MM (ex: "02:30")
 */
export const horasToHHMM = (horas) => {
    if (!horas || horas === 0) return '00:00';
    const h = Math.floor(horas);
    const m = Math.round((horas - h) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Converte formato HH:MM para horas decimais
 * @param {string} hhmm - Horas no formato HH:MM (ex: "02:30") ou apenas dígitos (ex: "0230")
 * @returns {number} Horas em formato decimal (ex: 2.5)
 */
export const hhmmToHoras = (hhmm) => {
    if (!hhmm) return 0;

    // Remove tudo que não é dígito
    const digitsOnly = hhmm.replace(/\D/g, '');

    if (digitsOnly === '' || digitsOnly === '0000' || digitsOnly === '00') return 0;

    // Se tem 4 dígitos ou mais, pega os 2 primeiros como hora e os próximos 2 como minuto
    if (digitsOnly.length >= 3) {
        const h = parseInt(digitsOnly.slice(0, -2), 10) || 0;
        const m = parseInt(digitsOnly.slice(-2), 10) || 0;
        return h + (m / 60);
    }

    // Se tem menos de 3 dígitos, considera apenas horas
    const h = parseInt(digitsOnly, 10) || 0;
    return h;
};

/**
 * Formata o período da semana para exibição
 * @param {Date} semanaAtual - Data de referência da semana
 * @returns {string} Período formatado (ex: "22/1/2026 - 28/1/2026")
 */
export const formatarPeriodoSemana = (semanaAtual) => {
    const inicio = new Date(semanaAtual);
    inicio.setDate(inicio.getDate() - inicio.getDay());

    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 6);

    return `${inicio.getDate()}/${inicio.getMonth() + 1}/${fim.getFullYear()} - ${fim.getDate()}/${fim.getMonth() + 1}/${fim.getFullYear()}`;
};

/**
 * Formata o período mensal para exibição
 * @param {Date} mesAtual - Data de referência do mês
 * @returns {string} Mês e ano formatados (ex: "Janeiro 2026")
 */
export const formatarPeriodoMensal = (mesAtual) => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${meses[mesAtual.getMonth()]} ${mesAtual.getFullYear()}`;
};

/**
 * Gera array com todos os dias do mês (incluindo dias adjacentes)
 * @param {Date} mesAtual - Data de referência do mês
 * @returns {Array<{dia: number, mesAtual: boolean, data: Date}>} Array com 42 dias (6 semanas)
 */
export const getDiasDoMes = (mesAtual) => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    const diasAnteriores = primeiroDia.getDay();
    const totalDias = ultimoDia.getDate();

    const dias = [];

    // Dias do mês anterior
    const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diasAnteriores - 1; i >= 0; i--) {
        dias.push({
            dia: ultimoDiaMesAnterior - i,
            mesAtual: false,
            data: new Date(ano, mes - 1, ultimoDiaMesAnterior - i)
        });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDias; i++) {
        dias.push({
            dia: i,
            mesAtual: true,
            data: new Date(ano, mes, i)
        });
    }

    // Dias do próximo mês
    const diasRestantes = 42 - dias.length; // 6 semanas x 7 dias
    for (let i = 1; i <= diasRestantes; i++) {
        dias.push({
            dia: i,
            mesAtual: false,
            data: new Date(ano, mes + 1, i)
        });
    }

    return dias;
};