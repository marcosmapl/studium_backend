import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faClipboardList, 
    faBook, 
    faFileAlt, 
    faCalendarAlt, 
    faRotate, 
    faChartLine, 
    faPenToSquare, 
    faLightbulb,
    faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('home');

    const menuItems = [
        { id: 'home', label: 'Home', icon: faHome, path: '/dashboard' },
        { id: 'planos', label: 'Planos de Estudo', icon: faClipboardList, path: '/planos' },
        { id: 'disciplinas', label: 'Disciplinas', icon: faBook, path: '/disciplinas' },
        // { id: 'edital', label: 'Edital', icon: faFileAlt, path: '/edital' },
        { id: 'planejamento', label: 'Planejamento', icon: faCalendarAlt, path: '/planejamento' },
        // { id: 'revisoes', label: 'Revisões', icon: faRotate, path: '/revisoes' },
        { id: 'historico', label: 'Histórico', icon: faClockRotateLeft, path: '/historico' },
        // { id: 'estatisticas', label: 'Estatísticas', icon: faChartLine, path: '/estatisticas' },
        // { id: 'simulados', label: 'Simulados', icon: faPenToSquare, path: '/simulados' },
        { id: 'dicas', label: 'Dicas de Estudo', icon: faLightbulb, path: '/dicas' },
    ];

    // Sincronizar activeMenu com a rota atual
    useEffect(() => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        if (currentItem) {
            setActiveMenu(currentItem.id);
        }
    }, [location.pathname]);

    const handleMenuClick = (item) => {
        setActiveMenu(item.id);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <aside className={`studium-sbar ${isOpen ? 'studium-sbar-open' : 'studium-sbar-closed'}`}>
            <nav className="studium-sbar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item)}
                        className={
                            activeMenu === item.id || location.pathname === item.path
                                ? 'studium-sbar-menu-item-active'
                                : 'studium-sbar-menu-item'
                        }
                    >
                        <FontAwesomeIcon icon={item.icon} className="studium-sbar-item-icon" />
                        <span className="studium-sbar-item-label">{item.label}</span>
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
