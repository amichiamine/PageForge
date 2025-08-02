import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { useState, createContext, useContext, useEffect } from "react";
import { runDevelopmentValidation } from "./lib/component-dev-tools";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import Editor from "@/pages/editor";
import Templates from "@/pages/templates";
import Documentation from "@/pages/documentation";
import VSCode from "@/pages/vscode";
import Deployment from "@/pages/deployment";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

// Context for managing sidebar visibility
const SidebarContext = createContext<{
  hideMainSidebar: boolean;
  setHideMainSidebar: (hide: boolean) => void;
}>({
  hideMainSidebar: false,
  setHideMainSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

function Router() {
  const [hideMainSidebar, setHideMainSidebar] = useState(false);
  const [location] = useLocation();
  
  // Validation automatique des composants en mode développement
  useEffect(() => {
    runDevelopmentValidation();
  }, []);
  
  // Show main sidebar unless explicitly hidden in editor
  const showMainSidebar = !hideMainSidebar;
  
  // Debug logs removed for production

  return (
    <SidebarContext.Provider value={{ hideMainSidebar, setHideMainSidebar }}>
      <div className="h-full flex overflow-hidden">
        {/* Left sidebar for navigation with collapsible functionality */}
        {showMainSidebar ? (
          <div className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            {/* Sidebar content */}
            <Sidebar />
          </div>
        ) : (
          <div className="w-12 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => setHideMainSidebar(false)}
                className="w-full h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Afficher la navigation"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 transition-colors duration-300">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/projects" component={Projects} />
            <Route path="/editor/:projectId?" component={Editor} />
            <Route path="/templates" component={Templates} />
            <Route path="/vscode" component={VSCode} />
            <Route path="/deployment" component={Deployment} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
