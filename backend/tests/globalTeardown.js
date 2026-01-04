/**
 * Global teardown - executado após todos os testes
 */

module.exports = async () => {
  // Pequeno delay para garantir que todas as conexões sejam fechadas
  await new Promise(resolve => setTimeout(resolve, 500));
};
