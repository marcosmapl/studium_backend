import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PlanoEstudoProvider } from './contexts/PlanoEstudoContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import PlanosEstudo from './pages/PlanosEstudo';
import Disciplinas from './pages/Disciplinas';
import Planejamento from './pages/Planejamento';
import Historico from './pages/Historico';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <PlanoEstudoProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/cadastro" element={<Cadastro />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/planos"
                            element={
                                <PrivateRoute>
                                    <PlanosEstudo />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/disciplinas"
                            element={
                                <PrivateRoute>
                                    <Disciplinas />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/planejamento"
                            element={
                                <PrivateRoute>
                                    <Planejamento />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/historico"
                            element={
                                <PrivateRoute>
                                    <Historico />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </PlanoEstudoProvider>
            </Router>
        </AuthProvider >
    );
}

export default App;
