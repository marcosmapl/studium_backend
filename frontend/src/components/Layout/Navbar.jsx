import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
    const { usuario, logout } = useAuth();
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

    return (
        <nav className="dashboard-nav shadow-md">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center gap-20">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={onToggleSidebar}
                            className="text-gray-600 hover:text-gray-900 p-2"
                            aria-label="Toggle sidebar"
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

                    <div className="flex items-center gap-4">
                        {/* Ícone de Notificações */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfileMenu(false);
                                }}
                                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                                aria-label="Notificações"
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
                                <div className="dropdown-base right-0 mt-2 w-80">
                                    <div className="dropdown-header flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800">Notificações</h3>
                                        <button
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                                            onClick={() => console.log('Limpar todas')}
                                        >
                                            Limpar todas
                                        </button>
                                    </div>
                                    <div className="dropdown-content">
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
                            aria-label="Alternar tema"
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
                                aria-label="Menu do perfil"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {(usuario?.nome || usuario?.nomeUsuario || 'U').charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {/* Dropdown do Perfil */}
                            {showProfileMenu && (
                                <div className="dropdown-base right-0 mt-2 w-56">
                                    <div className="dropdown-header">
                                        <p className="font-semibold text-gray-800">{usuario?.nome || usuario?.nomeUsuario}</p>
                                        <p className="text-xs text-gray-600">{usuario?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button className="dropdown-item">
                                            👤 Meu Perfil
                                        </button>
                                        <button className="dropdown-item">
                                            ⚙️ Preferências
                                        </button>
                                        <button className="dropdown-item">
                                            💳 Assinatura
                                        </button>
                                        <button className="dropdown-item">
                                            💡 Dicas de Estudo
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item dropdown-item-danger"
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
    );
};

Navbar.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
};

export default Navbar;
