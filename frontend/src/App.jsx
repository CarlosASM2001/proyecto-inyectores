import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/LoginPage';
import MainLayout from './layouts/MainLayout';
import ProductsPage from './pages/Inventory/ProductsPage';

// Asegúrate de importar tus páginas (o crea archivos temporales si no existen)
const DashboardPage = () => <div className="p-4 text-2xl font-bold">Bienvenido al Dashboard</div>;
const ClientsPage = () => <div className="p-4 text-2xl font-bold">Gestión de Clientes</div>;
// const ProductsPage = () => <div className="p-4 text-2xl font-bold">Inventario de Productos</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path='/login' element={<Login />} />

        {/* RUTAS PRIVADAS (Envueltas en el Layout) */}
        {/* Usamos path="/" para que sea la base de las privadas */}
        <Route path="/" element={<MainLayout />}>
          {/* Al usar index, le decimos que esta es la página por defecto al entrar a "/" */}
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>

        {/* Redirección global si la ruta no existe */}
        <Route path='*' element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;