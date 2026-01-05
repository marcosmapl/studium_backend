import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const { usuario, logout } = useAuth();
    const [activeMenu, setActiveMenu] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const notificacoes = [
        { id: 1, titulo: 'Nova revisão disponível', descricao: 'Matemática - Álgebra Linear', lida: false },
        { id: 2, titulo: 'Simulado agendado', descricao: 'Simulado geral - 15/01/2026', lida: false },
        { id: 3, titulo: 'Meta atingida!', descricao: 'Você completou 8h de estudo hoje', lida: false },
    ];

    const menuItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'planos', label: 'Planos de Estudo', icon: '📋' },
        { id: 'disciplinas', label: 'Disciplinas', icon: '📚' },
        { id: 'edital', label: 'Edital', icon: '📄' },
        { id: 'planejamento', label: 'Planejamento', icon: '📅' },
        { id: 'revisoes', label: 'Revisões', icon: '🔄' },
        { id: 'historico', label: 'Histórico', icon: '📊' },
        { id: 'estatisticas', label: 'Estatísticas', icon: '📈' },
        { id: 'simulados', label: 'Simulados', icon: '✍️' },
        { id: 'dicas', label: 'Dicas de Estudo', icon: '💡' },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#343c4b' }}>
            <nav className="dashboard-nav shadow-md">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center gap-20">
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-600 hover:text-gray-900 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-white">Studium</h1>
                        </div>

                        {/* Mensagem de Boas-vindas */}
                        <span className="text-white flex-1">
                            Bem-vindo, <span className="font-semibold">{usuario?.nome || "Visitante"}</span>
                        </span>

                        <div className="flex items-center gap-4">{/* Ícone de Notificações */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        setShowProfileMenu(false);
                                    }}
                                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {notificacoes.length > 0 && (
                                        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                                    )}
                                </button>

                                {/* Dropdown de Notificações */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-800">Notificações</h3>
                                            <button
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                                                onClick={() => {
                                                    // Função para limpar todas as notificações
                                                    console.log('Limpar todas');
                                                }}
                                            >
                                                Limpar todas
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notificacoes.length > 0 ? (
                                                notificacoes.map((notif) => (
                                                    <div key={notif.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 flex items-start justify-between gap-3 group">
                                                        <div className="flex-1 cursor-pointer">
                                                            <p className="font-semibold text-sm text-gray-800">{notif.titulo}</p>
                                                            <p className="text-xs text-gray-600 mt-1">{notif.descricao}</p>
                                                        </div>
                                                        <button
                                                            className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Função para excluir notificação específica
                                                                console.log('Excluir notificação', notif.id);
                                                            }}
                                                            title="Excluir notificação"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    Nenhuma notificação
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botão de Tema Claro/Escuro */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                                title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                            >
                                {darkMode ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {/* Menu de Perfil */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(!showProfileMenu);
                                        setShowNotifications(false);
                                    }}
                                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {(usuario?.nome || usuario?.nomeUsuario || 'U').charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {/* Dropdown do Perfil */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="p-4 border-b border-gray-200">
                                            <p className="font-semibold text-gray-800">{usuario?.nome || usuario?.nomeUsuario}</p>
                                            <p className="text-xs text-gray-600">{usuario?.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                👤 Meu Perfil
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                ⚙️ Preferências
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                💳 Assinatura
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                                                💡 Dicas de Estudo
                                            </button>
                                            <div className="border-t border-gray-200 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                            >
                                                🚪 Sair
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? 'w-60' : 'w-0'
                        } dashboard-sidebar shadow-lg transition-all duration-300 overflow-hidden`}
                    style={{ minHeight: 'calc(100vh - 64px)' }}
                >
                    <nav className="py-4 flex flex-col gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenu(item.id)}
                                className={`w-full flex items-center gap-2 px-6 py-2 text-left transition-colors ${activeMenu === item.id
                                    ? 'sidebar-menu-item-active'
                                    : 'sidebar-menu-item'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
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

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
