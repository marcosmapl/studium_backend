const BaseRepository = require("./BaseRepository");

class AlocacaoHorarioRepository extends BaseRepository {
  constructor() {
    super("alocacaoHorario");
    this.include = {
      diaEstudo: true,
      disciplinaCronograma: {
        include: {
          disciplina: true,
          planejamento: true,
        },
      },
    };
    this.defaultOrderBy = "ordem";
  }

  /**
   * Busca todas as alocações de horário de um dia de estudo específico
   * @param {number} diaEstudoId - ID do dia de estudo
   * @returns {Promise<Array>} Lista de alocações de horário
   */
  async findManyByDiaEstudoId(diaEstudoId) {
    return await this.findMany(
      { diaEstudoId: parseInt(diaEstudoId) },
      this.include,
      this.defaultOrderBy
    );
  }

  /**
   * Busca todas as alocações de horário de uma disciplina de planejamento específica
   * @param {number} disciplinaCronogramaId - ID da disciplina de planejamento
   * @returns {Promise<Array>} Lista de alocações de horário
   */
  async findManyByDisciplinaCronogramaId(disciplinaCronogramaId) {
    return await this.findMany(
      { disciplinaCronogramaId: parseInt(disciplinaCronogramaId) },
      this.include,
      this.defaultOrderBy
    );
  }
}

module.exports = AlocacaoHorarioRepository;
