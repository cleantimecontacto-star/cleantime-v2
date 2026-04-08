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

const DEFAULT_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAAEgCAIAAACb4TnXAAAAA3NCSVQICAjb4U/gAAAgAElEQVR4nO29d4BcVfn//375membYzO9t3szW9J4QECD0gBAgIiHz4UUQFBARUEMtHRKSKCIqAfikfRAVUFEQIPYQaQkhCSQIhvW7vdWan3nuf3x93ZramYe5G8HmRLJu595077pnzPuU5z3kuWZYFQRD2PwSwcqAzIQhfYEg70DkQhC8qDEB6MEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBGYIDiICEwQHEQEJggOIgITBAcRgQmCg4jABMFBRGCC4CAiMEFwEBEYABDRgc6C8MVEBAYi+qQuJBoTnEAEBgD3vVZ3oLMgfDH5bxcYEfVEEn9a2dMaiksnJux3/nsFRump1xNLG1CgP7G0AQCRqEzYn5BlWQc6DwcAIjIsa3N9+JG36+/ZFBmfpWyNWtdNDpx3RNHE8oBXV5n5QOdR+CLwuRcYEYBUp7OXqiCiLU3hF1c2/uDVZrioIt/rVskE7egwUN3z3fl5F584ZvbYYP/UiGjlpuaDxhR4dEWUJ+w9n2+B2eO5W/74fkvIuPd7h+uqsvcas3/5tLr9hMe3KZqrKWouPbfi6GlF9ueD0iGi3/9z7Vfmja4oCkjnJuw9n+M5GBGFY8lzf7Hk5teaHvigbdI1i3c2dO3lFIpTYHpV/ivnj2vqMBaeVnL0tKK+A0O4ern7J9s79vdDCF9wPq8CI6JNtZ2BS199amvYF9C8PnVHJDnm4sWLlu/YF0MFM/Ps8fnQ1RNmFQPD901E1NgRRVPiqQ9a9+MjCP8NfP4ERgQiev69nZOvfgce1ecigAF4VUWr8C64Y9UvHl/F2Ddr4MPzc/1ubTdDv+ffq0eh9/FPulu6Y2JnFPaez9kczK7cd/5t1XVP17gKXSozUvoCAAYIiEbMw8p8L91wdEG2Z2/mS0QUipsBtzL0XNuC0toeCuJBVeaOQWN0uO+OChFKe1OBaxfK06Xhow4T8wBqe5Z5h8U59VNI7AagIYY1RCFbAIbZ+yF7JZXfI5mHWh5fT9Yg+ZXS0RYAd2WISKrJ7AMsopKuoqECUaEcCItZAiWuiBIVJbR3V+IrNS0ILmomFXZXUELU7JNVuVp5FKiRiOFXdXI1RHNIlhfqX7KlkSqw5+7FKC+VbgqQvJzFVT4YkpMxeTcSGJ3XCqh1PJOoRg+1tK0fZQDAEMG7p/RaTaKssmysMBo7u9O5uJxgBv5Wd3oIDaTXMRq27I3p0FoMuZ9F8T0aTSz/e/vTTzd4oR9/tVvVLISOqnVN+nLz/5n7JK0xKGrmmABLLQFq+nAZqSvkBYJCDIDpPGmKKJSQMNSBgToJAAGi2yRrXqW0kkdlUYG7MmrPmpQW7DKlFNfzKRMj9e6aMuJ8d0ABnV6KkBRGABQIl4OFxBagBiXd4Ia+h5q9gvYnJMZsrIPbwCJnhXaOdKX/+RHyEAmtTZAU8cOKAdZyFTYeHQJcVJC7sXTJ4VJ74qr0cPTJXDm9HGPIZBBJjSDJgIVpMBGEBUHToHTOqiM4GFGkBVAbT3USFHjVRGCeqJlkFnumUSNB9hUmNJ4fR3pqtJlKTbWq9m2e5vBQ9b7LhHO64WJfMrHfnodOk05/Lc4Xwj4L0cNrGGVmHJI0AMtAFVBRnLMACNY5FHBihpBdqCy7HvVwvRGXJdLVmVW/MoTcxFjQc1tNNQkK5ysBQJvJuWHMGF5YOLvHJCEgmMEQJgB+wqJAilIDYHYxlBzCUuRMIMCIECnAZBQZqJlBm5oKGEbFNSpAHFHFagK2AoqMGbJsrMT5IhIgGBSCCBSMFJFIAAaSoQhBBCiCiSSyEsCSmRhCKQAJqRi2ioAAAA"; // truncated for brevity

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

        {/* Main content — min-h-0 es CLAVE: permite que flex-1 se comprima
            correctamente en un flex-col, habilitando el scroll interno */}
        <main className="flex-1 overflow-hidden min-h-0">
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
