import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, createContext, useContext, useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Projects from "@/pages/projects";
import EditorAdvanced from "@/pages/editor-advanced";
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
  
  // Show main sidebar unless explicitly hidden in editor
  const showMainSidebar = !hideMainSidebar;
  
  // Debug logs removed for production

  return (
    <SidebarContext.Provider value={{ hideMainSidebar, setHideMainSidebar }}>
      <div className="h-full flex overflow-hidden">
        {/* Left sidebar for navigation with collapsible functionality */}
        <div className={`transition-all duration-300 ${showMainSidebar ? 'w-56 sm:w-56' : 'w-12'} bg-theme-surface border-r border-theme-border flex flex-col`}>
          {/* Toggle button for main navigation */}
          <div className="p-2 border-b border-gray-700">
            <button
              onClick={() => setHideMainSidebar(!hideMainSidebar)}
              className="w-full h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={showMainSidebar ? "Masquer la navigation" : "Afficher la navigation"}
            >
              {showMainSidebar ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Sidebar content */}
          {showMainSidebar && <Sidebar />}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-theme-background transition-colors duration-300">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/projects" component={Projects} />
            <Route path="/editor/:projectId?" component={EditorAdvanced} />
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
