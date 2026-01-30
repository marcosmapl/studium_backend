import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import usePlanosEstudo from '../hooks/usePlanosEstudo.js';
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
    const { planos: planosEstudo, loading: loadingPlanos, reload: recarregar } = usePlanosEstudo(usuario?.id);

    const [planoSelecionado, setPlanoSelecionado] = useState(null);
    const [plano, setPlano] = useState(null);

    // Inicializa plano selecionado quando planos carregarem
    useEffect(() => {
        if (planosEstudo && planosEstudo.length > 0) {
            // Se veio de navegação com planoId, usa ele, senão usa o primeiro
            const planoIdFromNav = location.state?.planoId;
            const planoInicial = planoIdFromNav
                ? planosEstudo.find(p => p.id === planoIdFromNav)?.id || planosEstudo[0].id
                : planosEstudo[0].id;
            setPlanoSelecionado(planoInicial);
        } else {
            setPlanoSelecionado(null);
            setPlano(null);
        }
    }, [planosEstudo, location.state]);

    // Atualiza objeto plano completo quando planoSelecionado mudar
    useEffect(() => {
        if (planoSelecionado && planosEstudo) {
            const planoEncontrado = planosEstudo.find(p => p.id === planoSelecionado);
            setPlano(planoEncontrado || null);
        } else {
            setPlano(null);
        }
    }, [planoSelecionado, planosEstudo]);

    const value = {
        planoSelecionado,
        setPlanoSelecionado,
        plano,
        planosEstudo,
        loadingPlanos,
        recarregarPlanos: recarregar
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
