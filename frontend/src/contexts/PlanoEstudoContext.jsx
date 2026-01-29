import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlanoEstudoData } from '../hooks/usePlanoEstudoData.js';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const PlanoEstudoContext = createContext();

export const usePlanoEstudoContext = () => {
    const context = useContext(PlanoEstudoContext);
    if (!context) {
        throw new Error('usePlanoEstudoContext deve ser usado dentro de PlanoEstudoProvider');
    }
    return context;
};

export const PlanoEstudoProvider = ({ children }) => {
    const { usuario } = useAuth();
    const location = useLocation();
    const { loading: loadingPlanos, planosEstudo } = usePlanoEstudoData(usuario?.id);

    const [planoSelecionado, setPlanoSelecionado] = useState(null);

    // Inicializa plano selecionado quando planos carregarem
    useEffect(() => {
        if (planosEstudo && planosEstudo.length > 0) {
            // Se veio de navegação com planoId, usa ele, senão usa o primeiro
            const planoIdFromNav = location.state?.planoId;
            const planoInicial = planoIdFromNav
                ? planosEstudo.find(p => p.id === planoIdFromNav)?.id || planosEstudo[0].id
                : planosEstudo[0].id;
            setPlanoSelecionado(planoInicial);
        }
    }, [planosEstudo, location.state]);

    const value = {
        planoSelecionado,
        setPlanoSelecionado,
        planosEstudo,
        loadingPlanos
    };

    return (
        <PlanoEstudoContext.Provider value={value}>
            {children}
        </PlanoEstudoContext.Provider>
    );
};

PlanoEstudoProvider.propTypes = {
    children: PropTypes.node.isRequired
};
