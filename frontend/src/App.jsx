import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppRouteLoader from "./components/AppRouteLoader";

const Login = lazy(() => import("./pages/Auth/LoginPage"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const ClientsPage = lazy(() => import("./pages/Clients/ClientsPage"));
const ProductsPage = lazy(() => import("./pages/Inventory/ProductsPage"));
const ServicesPage = lazy(() => import("./pages/Services/ServicesPage"));
const InvoicesPage = lazy(() => import("./pages/Invoices/InvoicesPage"));
const Billinvoices_Page = lazy(() => import("./pages/Invoices/Billinvoices_Page"));
const RegisterClosePage = lazy(() => import("./pages/RegisterClose/RegisterClosePage"));
const DebtsPage = lazy(() => import("./pages/Debts/DebtsPage"));

function App() {
  return (
    <Router>
      <Suspense fallback={<AppRouteLoader />}>
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
              <Route path="invoices_Bill" element={<Billinvoices_Page />} />
              <Route path="registerClose" element={<RegisterClosePage />} />
              <Route path="debts" element={<DebtsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
