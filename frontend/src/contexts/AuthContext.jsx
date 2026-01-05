import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usuarioArmazenado = authService.getCurrentUser();
        if (usuarioArmazenado) {
            setUsuario(usuarioArmazenado);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        setUsuario(data.usuario);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUsuario(null);
    };

    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
