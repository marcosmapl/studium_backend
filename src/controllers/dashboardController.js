const prisma = require("../orm/prismaClient");
const logger = require("../config/logger");

/**
 * GET /api/dashboard/kpis
 * Retorna KPIs do dashboard
 *
 * Query Parameters:
 * - dataInicial (opcional): Data inicial do período (formato: YYYY-MM-DD)
 * - dataFinal (opcional): Data final do período (formato: YYYY-MM-DD)
 * - unidadeId (opcional): ID da unidade para filtrar os dados
 *
 * Se as datas não forem fornecidas, usa o mês atual
 */
exports.getKPIs = async (req, res) => {
  try {
    const { dataInicial, dataFinal, unidadeId } = req.query;

    // Validar e processar datas
    let startDate, endDate;

    if (dataInicial && dataFinal) {
      startDate = new Date(dataInicial);
      endDate = new Date(dataFinal);

      // Validar datas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        logger.warn("Datas inválidas fornecidas para KPIs", {
          route: req.originalUrl,
          dataInicial,
          dataFinal,
        });
        return res.status(400).json({
          error: "Datas inválidas. Use o formato YYYY-MM-DD",
        });
      }

      if (startDate > endDate) {
        logger.warn("Data inicial maior que data final", {
          route: req.originalUrl,
          dataInicial,
          dataFinal,
        });
        return res.status(400).json({
          error: "A data inicial não pode ser maior que a data final",
        });
      }

      // Ajustar endDate para incluir o dia completo (23:59:59)
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Usar mês atual como padrão
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Primeiro dia do mês
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ); // Último dia do mês
    }

    // Validar unidadeId se fornecido
    let unidadeFilter = undefined;
    if (unidadeId) {
      const unidadeIdNum = Number(unidadeId);
      if (!Number.isInteger(unidadeIdNum) || unidadeIdNum < 1) {
        logger.warn("ID de unidade inválido fornecido para KPIs", {
          route: req.originalUrl,
          unidadeId,
        });
        return res.status(400).json({
          error: "O parâmetro unidadeId deve ser um número inteiro positivo",
        });
      }
      unidadeFilter = unidadeIdNum;
    }

    // Construir filtros
    const veiculoFilter = unidadeFilter ? { unidadeId: unidadeFilter } : {};
    const vendaFilter = {
      dataVenda: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Se tiver filtro de unidade, precisamos filtrar vendas por veículos da unidade
    if (unidadeFilter) {
      vendaFilter.veiculo = {
        unidadeId: unidadeFilter,
      };
    }

    // Executar queries em paralelo para melhor performance
    const [totalVeiculos, quantidadeSeminovos, vendasDoMes, faturamentoData] =
      await Promise.all([
        // 1. Total de Veículos (da unidade se filtrado)
        prisma.veiculo.count({
          where: veiculoFilter,
        }),

        // 2. Quantidade de Seminovos (da unidade se filtrado)
        prisma.veiculo.count({
          where: {
            ...veiculoFilter,
            estadoVeiculo: {
              descricao: "SEMINOVO",
            },
          },
        }),

        // 3. Quantidade de Vendas no período
        prisma.vendaVeiculo.count({
          where: vendaFilter,
        }),

        // 4. Faturamento no período (soma dos valores de venda)
        prisma.vendaVeiculo.aggregate({
          where: vendaFilter,
          _sum: {
            valorVenda: true,
          },
        }),
      ]);

    // Calcular faturamento total
    const faturamentoMes = faturamentoData._sum.valorVenda
      ? parseFloat(faturamentoData._sum.valorVenda.toString())
      : 0.0;

    // Preparar resposta
    const kpis = {
      totalVeiculos,
      quantidadeSeminovos,
      quantidadeVendasMes: vendasDoMes,
      faturamentoMes,
      periodo: {
        dataInicial: startDate.toISOString().split("T")[0],
        dataFinal: endDate.toISOString().split("T")[0],
      },
    };

    // Adicionar informação da unidade se filtrado
    if (unidadeFilter) {
      const unidade = await prisma.unidade.findUnique({
        where: { id: unidadeFilter },
        select: { id: true, nome: true },
      });

      if (!unidade) {
        logger.warn("Unidade não encontrada para KPIs", {
          route: req.originalUrl,
          unidadeId: unidadeFilter,
        });
        return res.status(404).json({
          error: "Unidade não encontrada",
        });
      }

      kpis.unidade = unidade;
    }

    logger.info("KPIs calculados com sucesso", {
      route: req.originalUrl,
      unidadeId: unidadeFilter,
      periodo: kpis.periodo,
    });

    return res.json(kpis);
  } catch (error) {
    logger.error("Erro ao calcular KPIs", {
      error: error.message,
      stack: error.stack,
      route: req.originalUrl,
    });

    return res.status(500).json({
      error: "Erro ao calcular KPIs do dashboard",
      details: error.message,
    });
  }
};
