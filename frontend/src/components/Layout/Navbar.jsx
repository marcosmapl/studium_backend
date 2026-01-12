import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faCreditCard, faLightbulb, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

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
        <nav className="studium-nav">
            <div className="studium-nav-container">
                <div className="studium-nav-content">
                    <div className="studium-nav-left">
                        <button
                            onClick={onToggleSidebar}
                            className="studium-nav-toggle"
                            aria-label="Toggle sidebar"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="studium-nav-logo">Studium</h1>
                    </div>

                    {/* Mensagem de Boas-vindas */}
                    <span className="studium-nav-welcome">
                        Bem-vindo, <span className="studium-nav-welcome-name">{usuario?.nome || "Visitante"}</span>
                    </span>

                    <div className="studium-nav-actions">
                        {/* Ícone de Notificações */}
                        <div className="studium-nav-action-wrapper">
                            <button
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    setShowProfileMenu(false);
                                }}
                                className="studium-nav-action-btn"
                                aria-label="Notificações"
                            >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {notificacoes.length > 0 && (
                                    <span className="studium-nav-notif-badge"></span>
                                )}
                            </button>

                            {/* Dropdown de Notificações */}
                            {showNotifications && (
                                <div className="studium-nav-dropdown studium-nav-dropdown-notif">
                                    <div className="studium-nav-dropdown-header">
                                        <h3 className="studium-nav-dropdown-title">Notificações</h3>
                                        <button
                                            className="studium-nav-dropdown-clear"
                                            onClick={() => console.log('Limpar todas')}
                                        >
                                            Limpar todas
                                        </button>
                                    </div>
                                    <div className="studium-nav-dropdown-content">
                                        {notificacoes.length > 0 ? (
                                            notificacoes.map((notif) => (
                                                <div key={notif.id} className="studium-nav-notif-item">
                                                    <div className="studium-nav-notif-content">
                                                        <p className="studium-nav-notif-title">{notif.titulo}</p>
                                                        <p className="studium-nav-notif-desc">{notif.descricao}</p>
                                                    </div>
                                                    <button
                                                        className="studium-nav-notif-delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log('Excluir notificação', notif.id);
                                                        }}
                                                        title="Excluir notificação"
                                                    >
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="studium-nav-notif-empty">
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
                            className="studium-nav-action-btn"
                            title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                            aria-label="Alternar tema"
                        >
                            {darkMode ? (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* Menu de Perfil */}
                        <div className="studium-nav-action-wrapper">
                            <button
                                onClick={() => {
                                    setShowProfileMenu(!showProfileMenu);
                                    setShowNotifications(false);
                                }}
                                className="studium-nav-profile-btn"
                                aria-label="Menu do perfil"
                            >
                                <div className="studium-nav-avatar">
                                    {(usuario?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {/* Dropdown do Perfil */}
                            {showProfileMenu && (
                                <div className="studium-nav-dropdown">
                                    <div className="studium-nav-profile-info">
                                        <p className="studium-nav-profile-name">{usuario?.nome || usuario?.nomeUsuario}</p>
                                        <p className="studium-nav-profile-email">{usuario?.email}</p>
                                    </div>
                                    <div className="studium-nav-profile-menu">
                                        <button className="studium-nav-profile-item">
                                            <FontAwesomeIcon icon={faUser} /> Meu Perfil
                                        </button>
                                        <button className="studium-nav-profile-item">
                                            <FontAwesomeIcon icon={faCog} /> Preferências
                                        </button>
                                        <button className="studium-nav-profile-item">
                                            <FontAwesomeIcon icon={faCreditCard} /> Assinatura
                                        </button>
                                        <button className="studium-nav-profile-item">
                                            <FontAwesomeIcon icon={faLightbulb} /> Dicas de Estudo
                                        </button>
                                        <div className="studium-nav-profile-divider"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="studium-nav-profile-item studium-nav-profile-item-danger"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} /> Sair
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
