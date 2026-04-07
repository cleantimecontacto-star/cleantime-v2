import { type ReactNode, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  HardHat,
  Receipt,
  Download,
  Settings,
  FolderOpen,
  X,
  Sun,
  Moon,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useInstallPrompt } from "@/hooks/use-install-prompt.ts";
import { useTheme } from "@/hooks/use-theme.ts";
import { useAuth } from "@/auth/AuthContext.tsx";

const DEFAULT_LOGO = "data:image/png;base64,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";

type NavItem = {
  label: string;
  icon: ReactNode;
  path: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", icon: <LayoutDashboard size={20} />, path: "/" },
  { label: "Configuración", icon: <Settings size={20} />, path: "/configuracion" },
  { label: "Nueva", icon: <FilePlus size={20} />, path: "/cotizacion/nueva" },
  { label: "Cotizaciones", icon: <FileText size={20} />, path: "/cotizaciones" },
  { label: "Clientes", icon: <Users size={20} />, path: "/clientes" },
  { label: "Trabajadores", icon: <HardHat size={20} />, path: "/trabajadores" },
  { label: "Gastos", icon: <Receipt size={20} />, path: "/gastos" },
  { label: "Documentos", icon: <FolderOpen size={20} />, path: "/documentos" },
  { label: "Exportar", icon: <Download size={20} />, path: "/exportar" },
];

// Items principales en barra inferior
const BOTTOM_NAV_ITEMS = [
  NAV_ITEMS[0], // Inicio
  NAV_ITEMS[2], // Nueva cotización
  NAV_ITEMS[3], // Cotizaciones
  NAV_ITEMS[4], // Clientes
  NAV_ITEMS[7], // Documentos
];

// Items que van en el panel "Más"
const MORE_NAV_ITEMS = [
  NAV_ITEMS[1], // Configuración
  NAV_ITEMS[5], // Trabajadores
  NAV_ITEMS[6], // Gastos
  NAV_ITEMS[8], // Exportar
];

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
};

export default function AppLayout({ children, title, headerRight }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { canInstall, install } = useInstallPrompt();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { theme, toggle } = useTheme();
  const { logout } = useAuth();
  const config = useQuery(api.config.getAll);
  const logoUrl = config?.["logo_url"] ?? "";

  function isActive(path: string) {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* ── Sidebar — visible solo en md+ ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-gray-800 border-r border-gray-700">
        {/* Logo / nombre app */}
        <div className="px-4 py-3 border-b border-gray-700 flex items-center">
          {(logoUrl || DEFAULT_LOGO) ? (
            <img src={logoUrl || DEFAULT_LOGO} alt="Logo" className="max-h-10 max-w-[160px] object-contain" />
          ) : (
            <span className="text-blue-400 font-bold text-lg tracking-tight">CleanTime</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left",
                isActive(item.path)
                  ? "bg-gray-700 text-blue-400"
                  : "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Theme toggle + Logout at bottom */}
        <div className="px-4 py-3 border-t border-gray-700 space-y-2">
          <button
            onClick={toggle}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-100 text-xs transition-colors w-full"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </button>
          <button
            onClick={() => { if (window.confirm("¿Cerrar sesión?")) logout(); }}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-xs transition-colors w-full"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Main column ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Install banner */}
        {canInstall && !bannerDismissed && (
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-xs shrink-0">
            <span className="font-medium">Instala la app en tu dispositivo</span>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={async () => { await install(); }}
                className="flex items-center gap-1 bg-primary-foreground text-primary font-semibold px-2 py-0.5 rounded text-[11px]"
              >
                <Download size={11} /> Instalar
              </button>
              <button onClick={() => setBannerDismissed(true)} className="p-0.5 opacity-70 hover:opacity-100">
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {/* Top header */}
        <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shrink-0">
          <div>
            {title && <h1 className="text-lg font-bold leading-tight">{title}</h1>}
          </div>
          <div className="flex items-center gap-2">
            {/* Theme toggle solo en móvil (en PC está en sidebar) */}
            <button
              onClick={toggle}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => { if (window.confirm("¿Cerrar sesión?")) logout(); }}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
            {headerRight}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* ── Bottom navigation — visible solo en móvil ─────────────── */}
        <nav className="md:hidden shrink-0 bg-gray-800 border-t border-gray-700 pb-safe relative">
          {/* Panel "Más" — encima de la barra, sin scroll */}
          {showMore && (
            <>
              {/* Overlay oscuro para cerrar al tocar fuera */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMore(false)}
              />
              <div className="absolute bottom-full left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 grid grid-cols-4 pb-safe">
                {MORE_NAV_ITEMS.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setShowMore(false); }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-0.5 py-3 px-1 text-[9px] font-medium transition-colors",
                      isActive(item.path) ? "text-blue-400" : "text-gray-400 hover:text-gray-100"
                    )}
                  >
                    {item.icon}
                    <span className="truncate w-full text-center">{item.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="flex items-stretch justify-around">
            {BOTTOM_NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setShowMore(false); }}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 px-0.5 flex-1 text-[9px] font-medium transition-colors",
                  isActive(item.path)
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-100"
                )}
              >
                {item.icon}
                <span className="truncate w-full text-center">{item.label.split(" ")[0]}</span>
              </button>
            ))}
            {/* Botón "Más" */}
            <button
              onClick={() => setShowMore(v => !v)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 px-0.5 flex-1 text-[9px] font-medium transition-colors",
                showMore ? "text-blue-400" : "text-gray-400 hover:text-gray-100"
              )}
            >
              <MoreHorizontal size={20} />
              <span>Más</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
