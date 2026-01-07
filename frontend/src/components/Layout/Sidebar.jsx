import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('home');

    const menuItems = [
        { id: 'home', label: 'Home', icon: '🏠', path: '/dashboard' },
        { id: 'planos', label: 'Planos de Estudo', icon: '📋', path: '/planos' },
        { id: 'disciplinas', label: 'Disciplinas', icon: '📚', path: '/disciplinas' },
        { id: 'edital', label: 'Edital', icon: '📄', path: '/edital' },
        { id: 'planejamento', label: 'Planejamento', icon: '📅', path: '/planejamento' },
        { id: 'revisoes', label: 'Revisões', icon: '🔄', path: '/revisoes' },
        { id: 'historico', label: 'Histórico', icon: '📊', path: '/historico' },
        { id: 'estatisticas', label: 'Estatísticas', icon: '📈', path: '/estatisticas' },
        { id: 'simulados', label: 'Simulados', icon: '✍️', path: '/simulados' },
        { id: 'dicas', label: 'Dicas de Estudo', icon: '💡', path: '/dicas' },
    ];

    const handleMenuClick = (item) => {
        setActiveMenu(item.id);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item)}
                        className={
                            activeMenu === item.id || location.pathname === item.path
                                ? 'sidebar-menu-item-active'
                                : 'sidebar-menu-item'
                        }
                    >
                        <span className="sidebar-item-icon">{item.icon}</span>
                        <span className="sidebar-item-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;
