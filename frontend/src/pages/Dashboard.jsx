import Layout from '../components/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBullseye, faChartBar, faFire } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <Layout>
            <div className="studium-dashboard-container">
                <h2 className="studium-dashboard-title">Dashboard</h2>

                {/* Seção de Métricas */}
                <div className="studium-dashboard-grid">
                    {/* Tempo de Estudo */}
                    <div className="studium-card-base studium-dashboard-card">
                        <div className="studium-card-header">
                            <FontAwesomeIcon icon={faClock} className="studium-card-icon" />
                            <h3 className="studium-card-title ml-2">Tempo de Estudo</h3>
                        </div>
                        <div className="studium-card-content-flex">
                            <div className="kpi-details">
                            </div>
                            <p className="studium-card-value">100h</p>
                        </div>
                    </div>

                    {/* Desempenho */}
                    <div className="studium-card-base studium-dashboard-card">
                        <div className="studium-card-header">
                            <FontAwesomeIcon icon={faBullseye} className="studium-card-icon" />
                            <h3 className="studium-card-title ml-2">Desempenho</h3>
                        </div>
                        <div className="studium-card-content-flex">
                            <div className="kpi-details">
                                <p className="text-md font-bold text-success ml-3">90 acertos</p>
                                <p className="text-md font-bold text-error ml-3">10 erros</p>
                            </div>
                            <p className="studium-card-value">83%</p>
                        </div>
                    </div>

                    {/* Progresso no Edital */}
                    <div className="studium-card-base studium-dashboard-card">
                        <div className="studium-card-header">
                            <FontAwesomeIcon icon={faChartBar} className="studium-card-icon" />
                            <h3 className="studium-card-title ml-2">Progresso no Edital</h3>
                        </div>
                        <div className="studium-card-content-flex">
                            <div className="kpi-details">
                                <p className="text-md font-bold text-success ml-3">85 Concluídos</p>
                                <p className="text-md font-bold text-error ml-3">64 Pendentes</p>
                            </div>
                            <p className="studium-card-value">57%</p>
                        </div>
                    </div>

                    {/* Constância nos Estudos */}
                    <div className="studium-card-base studium-dashboard-card">
                        <div className="studium-card-header">
                            <FontAwesomeIcon icon={faFire} className="studium-card-icon" />
                            <h3 className="studium-card-title ml-2">Constância nos Estudos</h3>
                        </div>
                        <div className="studium-card-content-flex">
                            <div className="kpi-details">
                                <p className="text-md font-bold text-success ml-3">218 Estudados</p>
                                <p className="text-md font-bold text-error ml-3">32 Falhados</p>
                            </div>
                            <p className="studium-card-value">87%</p>
                        </div>
                    </div>
                </div>

                {/* Seção de Constância nos Estudos */}
                <div className="section-base study-consistency-section">
                    <h3 className="section-title ml-2">Constância nos Estudos</h3>
                    <p className="section-content text-lg m-md">
                        Você está há<span className="font-bold text-success ml-1">5 dias</span> sem falhar!
                        Seu recorde é de <span className="font-bold text-warning ml-1">18 dias</span>.
                    </p>

                    {/* Grid de 30 dias */}
                    <div className="study-days-grid">
                        {[...Array(30)].map((_, index) => {
                            // Simulando dados: verdadeiro = estudou, falso = não estudou
                            const estudou = Math.random() > 0.2; // 80% de chance de ter estudado

                            return (
                                <div
                                    key={index}
                                    className="study-day-item"
                                    title={`Dia ${index + 1}: ${estudou ? 'Estudou' : 'Não estudou'}`}
                                >
                                    {estudou ? (
                                        <svg className="study-icon-success" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" className="study-icon-bg" />
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    ) : (
                                        <svg className="study-icon-error" fill="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" className="study-icon-bg" />
                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
