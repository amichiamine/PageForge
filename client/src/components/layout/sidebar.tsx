import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  FolderOpen,
  Layout,
  Code,
  Cloud,
  Book,
  Settings,
  PanelLeftClose,
} from "lucide-react";
import { ResizableSidebar } from "@/components/ui/resizable-sidebar";
import { useSidebarContext } from "@/App";

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: Home },
  { name: "Mes projets", href: "/projects", icon: FolderOpen },
  { name: "Templates", href: "/templates", icon: Layout },
];

const integration = [
  { name: "VS Code", href: "/vscode", icon: Code },
  { name: "Déploiement", href: "/deployment", icon: Cloud },
];

const documentation = [
  { name: "Guide d'usage", href: "/documentation", icon: Book },
  { name: "Configuration", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const context = useSidebarContext();
  console.log('🔍 CONTEXTE COMPLET reçu:', context);
  console.log('🔍 Type setHideMainSidebar reçu:', typeof context.setHideMainSidebar);
  console.log('🔍 toString fonction reçue:', context.setHideMainSidebar.toString().substring(0, 150));
  
  const { hideMainSidebar, setHideMainSidebar } = context;
  
  console.log('🔄 RENDER Sidebar - hideMainSidebar from context:', hideMainSidebar);

  return (
    <ResizableSidebar
      defaultWidth={220}
      minWidth={120}
      maxWidth={400}
      storageKey="main-sidebar-width"
      direction="right"
      className="h-full"
      title="Navigation"
    >
      <div className="h-full overflow-hidden flex flex-col">
        {/* Header compact avec logo cliquable séparé */}
        <div className="flex items-center p-2 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0 w-full">
            {/* Logo cliquable pour masquer */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚀 DIRECT CLIC - État avant:', hideMainSidebar);
                console.log('🚀 Type fonction récupérée:', typeof setHideMainSidebar);
                console.log('🚀 Fonction toString:', setHideMainSidebar.toString().substring(0, 100));
                setHideMainSidebar(true);
                console.log('🚀 DIRECT CLIC - Fonction exécutée');
              }}
              className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors cursor-pointer"
              title="Cliquer sur le logo pour masquer la navigation"
            >
              <Code className="w-3 h-3 text-white" />
            </button>
            {/* Texte non cliquable */}
            <span className="text-gray-900 font-semibold text-xs truncate">SiteJet</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-1.5">
          <div className="space-y-1 mb-4">
            {navigation.map((item) => {
              const isActive = location === item.href || 
                             (item.href === "/dashboard" && location === "/");
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer group",
                      isActive
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    title={item.name}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 mr-2 flex-shrink-0",
                      isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                    )} />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 truncate">
              Outils
            </h3>
            <div className="space-y-1 mb-4">
              {integration.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer group",
                        isActive
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      title={item.name}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 mr-2 flex-shrink-0",
                        isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 truncate">
              Aide
            </h3>
            <div className="space-y-1">
              {documentation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center px-2 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer group",
                        isActive
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      )}
                      title={item.name}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 mr-2 flex-shrink-0",
                        isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </ResizableSidebar>
  );
}