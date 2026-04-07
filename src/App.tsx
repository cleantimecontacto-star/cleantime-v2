import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import QuoteForm from "./pages/QuoteForm.tsx";
import QuotesList from "./pages/QuotesList.tsx";
import ClientsPage from "./pages/ClientsPage.tsx";
import WorkersPage from "./pages/WorkersPage.tsx";
import ExpensesPage from "./pages/ExpensesPage.tsx";
import ExportPage from "./pages/ExportPage.tsx";
import ConfigPage from "./pages/ConfigPage.tsx";
import ChangeStatusPage from "./pages/ChangeStatusPage.tsx";
import DocumentsPage from "./pages/DocumentsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import { useAuth } from "./auth/AuthContext.tsx";
import { useServiceWorker } from "@/hooks/use-service-worker.ts";

// Protege las rutas: si no hay sesión, redirige al login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  useServiceWorker();
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública — login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas — requieren sesión */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cotizaciones" element={<ProtectedRoute><QuotesList /></ProtectedRoute>} />
          <Route path="/cotizacion/nueva" element={<ProtectedRoute><QuoteForm /></ProtectedRoute>} />
          <Route path="/cotizacion/:id/editar" element={<ProtectedRoute><QuoteForm /></ProtectedRoute>} />
          <Route path="/cotizacion/:id/cambiar-estado" element={<ProtectedRoute><ChangeStatusPage /></ProtectedRoute>} />
          <Route path="/clientes" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
          <Route path="/trabajadores" element={<ProtectedRoute><WorkersPage /></ProtectedRoute>} />
          <Route path="/gastos" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
          <Route path="/exportar" element={<ProtectedRoute><ExportPage /></ProtectedRoute>} />
          <Route path="/documentos" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />

          {/* Callback de auth (público) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
