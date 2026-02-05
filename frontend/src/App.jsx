import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/LoginPage";
import MainLayout from "./layouts/MainLayout";
import ProductsPage from "./pages/Inventory/ProductsPage";
import ClientsPage from "./pages/Clients/ClientsPage";
import ServicesPage from "./pages/Services/ServicesPage";
import InvoicesPage from "./pages/Invoices/InvoicesPage";
import RegisterClosePage from "./pages/RegisterClose/RegisterClosePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DebtsPage from "./pages/Debts/DebtsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="registerClose" element={<RegisterClosePage />} />
            <Route path="debts" element={<DebtsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
