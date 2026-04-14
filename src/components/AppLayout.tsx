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
        <main className="flex-1 overflow-y-auto min-h-0">
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
