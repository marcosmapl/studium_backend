import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Studium</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Bem-vindo, <span className="font-semibold">{usuario?.nomeFuncionario || usuario?.nomeUsuario}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
          <p className="text-gray-600">
            Bem-vindo ao sistema de gestão e planejamento de estudos Studium.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Planejamentos</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Sessões de Estudo</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Revisões</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
