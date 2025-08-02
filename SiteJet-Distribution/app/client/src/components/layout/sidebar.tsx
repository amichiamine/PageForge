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
} from "lucide-react";

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

  return (
    <div className="flex-shrink-0 w-64 bg-theme-surface border-r border-theme-border h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-theme-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-theme-primary rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <span className="text-theme-text font-semibold text-lg">PageForge</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
                           (item.href === "/dashboard" && location === "/");
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-white bg-theme-primary"
                      : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-background"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 px-3">
          <h3 className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-3">
            Intégration
          </h3>
          <div className="space-y-2">
            {integration.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "text-white bg-theme-primary"
                        : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-background"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 px-3">
          <h3 className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-3">
            Documentation
          </h3>
          <div className="space-y-2">
            {documentation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "text-white bg-theme-primary"
                        : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-background"
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}