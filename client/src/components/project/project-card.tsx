import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Edit, Eye, MoreVertical, Trash2, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
  typeInfo?: {
    icon: React.ComponentType<any>;
    label: string;
    color: string;
  };
}

const getProjectGradient = (type: string) => {
  switch (type) {
    case "single-page":
      return "from-blue-500 to-blue-600";
    case "multi-page":
      return "from-green-500 to-green-600";
    case "ftp-sync":
      return "from-purple-500 to-purple-600";
    case "ftp-upload":
      return "from-orange-500 to-orange-600";
    default:
      return "from-blue-500 to-purple-600";
  }
};

export default function ProjectCard({ project, viewMode = 'grid', typeInfo }: ProjectCardProps) {
  const [, setLocation] = useLocation();

  const handleEdit = () => {
    setLocation(`/editor/${project.id}`);
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview project:", project.id);
  };

  const IconComponent = typeInfo?.icon;

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 bg-theme-surface border-theme-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Project Icon */}
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${getProjectGradient(project.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              {IconComponent ? (
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded" />
              )}
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-theme-text text-sm sm:text-base truncate">
                  {project.name}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  {typeInfo && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${typeInfo.color} border-current/20 hidden sm:inline-flex`}
                    >
                      {typeInfo.label}
                    </Badge>
                  )}
                </div>
              </div>
              
              {project.description && (
                <p className="text-theme-text-secondary text-xs sm:text-sm line-clamp-1 mb-2">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-theme-text-secondary">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(project.updatedAt), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreview}
                    className="h-6 w-6 p-0 touch-friendly-compact"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-6 w-6 p-0 touch-friendly-compact"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 bg-theme-surface border-theme-border card-responsive">
      {/* Project Thumbnail */}
      <div className={`h-32 sm:h-40 bg-gradient-to-br ${getProjectGradient(project.type)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Preview elements */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="w-12 h-2 sm:w-16 sm:h-3 bg-white bg-opacity-30 rounded mb-1 sm:mb-2"></div>
          <div className="w-8 h-1.5 sm:w-12 sm:h-2 bg-white bg-opacity-30 rounded"></div>
        </div>
        
        {/* Project type badge */}
        <div className="absolute top-3 right-3">
          {typeInfo ? (
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 text-xs"
            >
              {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
              <span className="hidden sm:inline">{typeInfo.label}</span>
              <span className="sm:hidden">{typeInfo.label.split(' ')[0]}</span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              {project.type}
            </Badge>
          )}
        </div>
      </div>

      {/* Project Info */}
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-theme-text text-sm sm:text-lg truncate flex-1">
            {project.name}
          </h3>
        </div>
        
        {project.description && (
          <p className="text-theme-text-secondary text-xs sm:text-sm line-clamp-2 mb-3">
            {project.description}
          </p>
        )}
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-theme-text-secondary mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {formatDistanceToNow(new Date(project.updatedAt), { 
                addSuffix: true, 
                locale: fr 
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Actif</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex-1 button-responsive-compact touch-friendly-compact"
          >
            <Eye className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Aperçu</span>
            <span className="sm:hidden">Voir</span>
          </Button>
          <Button
            size="sm"
            onClick={handleEdit}
            className="flex-1 button-responsive-compact touch-friendly-compact"
          >
            <Edit className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Modifier</span>
            <span className="sm:hidden">Edit</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}