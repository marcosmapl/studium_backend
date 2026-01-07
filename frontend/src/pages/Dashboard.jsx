import Layout from '../components/Layout/Layout';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <Layout>
            <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>

            {/* Seção de Métricas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Tempo de Estudo */}
                <div className="kpi-card p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl">⏱️</span>
                        <h3 className="text-2xl font-semibold kpi-card-title">Tempo de Estudo</h3>
                    </div>
                    <p className="text-3xl font-bold text-right mt-auto kpi-card-value">100h</p>
                </div>

                {/* Desempenho */}
                <div className="kpi-card p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl">🎯</span>
                        <h3 className="text-2xl font-semibold kpi-card-title">Desempenho</h3>
                    </div>
                    <p className="text-xs font-bold text-green-600 ml-12">90 acertos</p>
                    <p className="text-xs font-bold text-red-600 ml-12">10 erros</p>
                    <p className="text-3xl font-bold text-right mt-auto kpi-card-value">83%</p>
                </div>

                {/* Progresso no Edital */}
                <div className="kpi-card p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl">📊</span>
                        <h3 className="text-2xl font-semibold kpi-card-title">Progresso no Edital</h3>
                    </div>
                    <p className="text-xs font-bold text-green-600 ml-12">85 Concluídos</p>
                    <p className="text-xs font-bold text-red-600 ml-12">64 Pendentes</p>
                    <p className="text-3xl font-bold text-right mt-auto kpi-card-value">57%</p>
                </div>

                {/* Constância nos Estudos */}
                <div className="kpi-card p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl">🔥</span>
                        <h3 className="text-2xl font-semibold kpi-card-title">Constância nos Estudos</h3>
                    </div>
                    <p className="text-xs font-bold text-green-600 ml-12">218 Estudados</p>
                    <p className="text-xs font-bold text-red-600 ml-12">32 Falhados</p>
                    <p className="text-3xl font-bold text-right mt-auto kpi-card-value">87%</p>
                </div>
            </div>

            {/* Seção de Constância nos Estudos */}
            <div className="study-consistency-section mt-6 rounded-lg shadow-md p-4 border">
                <h3 className="text-xl font-bold study-consistency-title mb-1">Constância nos Estudos</h3>
                <p className="mb-4 study-consistency-text">
                    Você está há <span className="font-bold text-green-400">5 dias</span> sem falhar!
                    Seu recorde é de <span className="font-bold text-yellow-300">18 dias</span>.
                </p>

                {/* Grid de 30 dias */}
                <div className="study-days-grid">
                    {[...Array(30)].map((_, index) => {
                        // Simulando dados: verdadeiro = estudou, falso = não estudou
                        const estudou = Math.random() > 0.2; // 80% de chance de ter estudado

                        return (
                            <div
                                key={index}
                                className="relative group"
                                title={`Dia ${index + 1}: ${estudou ? 'Estudou' : 'Não estudou'}`}
                            >
                                {estudou ? (
                                    // Check verde
                                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" className="opacity-15" />
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                ) : (
                                    // Cross vermelho
                                    <svg className="w-7 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" className="opacity-15" />
                                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
