/**
 * Configurações da aplicação
 * Centraliza informações de versão, ambiente e configurações gerais
 */

// Importa a versão do package.json
import packageJson from '../../package.json';

export const APP_CONFIG = {
    // Versão da aplicação (sincronizada com package.json)
    version: packageJson.version || '1.0.0',

    // Nome da aplicação
    name: 'Studium Frontend',

    // Ambiente (development, production, staging)
    environment: import.meta.env.MODE || 'development',

    // Se está em produção
    isProduction: import.meta.env.PROD,

    // Se está em desenvolvimento
    isDevelopment: import.meta.env.DEV,

    // URL base da API
    apiBaseUrl: import.meta.env.STUDIUM_BACKEND_API_URL || 'http://localhost:3333/api',

    // Configurações de logs
    logging: {
        // Habilita logs no console em desenvolvimento
        consoleLogging: import.meta.env.DEV,

        // Níveis de log que devem ser enviados ao backend
        // Em produção, enviar apenas warning e error
        enabledLevels: import.meta.env.PROD
            ? ['warning', 'error']
            : ['debug', 'info', 'warning', 'error'],

        // Tamanho do buffer antes de enviar logs
        bufferSize: import.meta.env.PROD ? 20 : 50,

        // Intervalo de flush automático (ms)
        flushInterval: import.meta.env.PROD ? 3000 : 5000,

        // Enviar logs imediatamente em erros críticos
        flushOnError: true,

        // Salvar logs no localStorage como backup
        useLocalStorageBackup: true
    },

    // Informações do build
    build: {
        timestamp: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString(),
        commitHash: import.meta.env.VITE_COMMIT_HASH || 'unknown'
    },

    // Features flags (habilitar/desabilitar funcionalidades)
    features: {
        enableAnalytics: import.meta.env.PROD,
        enableServiceWorker: import.meta.env.PROD,
        enableDebugTools: import.meta.env.DEV
    }
};

/**
 * Retorna informações resumidas da aplicação
 */
export const getAppInfo = () => ({
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    environment: APP_CONFIG.environment,
    buildTime: APP_CONFIG.build.timestamp,
    commitHash: APP_CONFIG.build.commitHash
});

/**
 * Retorna string formatada da versão completa
 */
export const getVersionString = () => {
    const { version, environment, build } = APP_CONFIG;
    return `v${version} (${environment}) - ${build.commitHash.substring(0, 7)}`;
};

/**
 * Verifica se um nível de log deve ser enviado
 */
export const shouldLogLevel = (level) => {
    return APP_CONFIG.logging.enabledLevels.includes(level.toLowerCase());
};

export default APP_CONFIG;
