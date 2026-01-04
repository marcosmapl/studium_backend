const BaseRepository = require("./BaseRepository");

class PrismaAlocacaoHorarioRepository extends BaseRepository {

  constructor() {
    super("alocacaoHorario", "AlocacaoHorarioRepository.js", {
      defaultOrderBy: "ordem",
      orderDirection: "asc",
      includeRelations: {
        diaEstudo: true,
        disciplinaCronograma: {
          include: {
            disciplina: true,
            planejamento: true,
          },
        },
      },
    });
  }

  /**
   * Busca todas as alocações de horário de um dia de estudo específico
   * @param {number} diaEstudoId - ID do dia de estudo
   * @returns {Promise<Array>} Lista de alocações de horário
   */
  async findManyByDiaEstudoId(diaEstudoId) {
    return await this.findMany({
      diaEstudoId: parseInt(diaEstudoId),
    });
  }

  /**
   * Busca todas as alocações de horário de uma disciplina de planejamento específica
   * @param {number} disciplinaCronogramaId - ID da disciplina de planejamento
   * @returns {Promise<Array>} Lista de alocações de horário
   */
  async findManyByDisciplinaCronogramaId(disciplinaCronogramaId) {
    return await this.findMany({
      disciplinaCronogramaId: parseInt(disciplinaCronogramaId),
    });
  }
}

module.exports = PrismaAlocacaoHorarioRepository;
