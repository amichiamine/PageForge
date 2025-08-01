import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FolderOpen, 
  PaintbrushVertical, 
  Layout, 
  Code, 
  Cloud, 
  Book, 
  Settings, 
  User,
  MoreHorizontal
} from "lucide-react";

const navigation = [
  { name: "Tableau de Bord", href: "/dashboard", icon: Home },
  { name: "Projets", href: "/projects", icon: FolderOpen },
  { name: "Éditeur Visuel", href: "/editor", icon: PaintbrushVertical },
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
    <div className="flex-shrink-0 w-full bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center px-3 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <Code className="w-3 h-3 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">PageForge</span>
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
                    "flex items-center px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-3 h-3 mr-2" />
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 px-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Intégration
          </h3>
          <div className="space-y-1">
            {integration.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "text-white bg-gray-800"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-3 h-3 mr-2" />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 px-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Documentation
          </h3>
          <div className="space-y-1">
            {documentation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer",
                      isActive
                        ? "text-white bg-gray-800"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-3 h-3 mr-2" />
                    <span className="truncate">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 w-full p-2 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Développeur</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-6 w-6 p-0">
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
