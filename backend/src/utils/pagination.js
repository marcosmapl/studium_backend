/**
 * Extrai e valida parâmetros de paginação da query string
 * @param {Object} query - req.query
 * @returns {Object} - { page, limit, skip, orderBy, orderDirection }
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const orderBy = query.orderBy || "id";
  const orderDirection =
    query.orderDirection?.toLowerCase() === "desc" ? "desc" : "asc";

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    orderBy,
    orderDirection,
  };
};

/**
 * Cria resposta paginada padronizada
 * @param {Array} data - Dados da página atual
 * @param {Number} total - Total de registros
 * @param {Number} page - Página atual
 * @param {Number} limit - Itens por página
 * @returns {Object} - Resposta formatada
 */
const createPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

module.exports = {
  getPaginationParams,
  createPaginatedResponse,
};
