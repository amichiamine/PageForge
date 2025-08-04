import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

const getProjectGradient = (type: string) => {
  switch (type) {
    case "ecommerce":
      return "from-green-500 to-teal-600";
    case "portfolio":
      return "from-purple-500 to-pink-600";
    case "vscode-integration":
      return "from-blue-500 to-indigo-600";
    default:
      return "from-blue-500 to-purple-600";
  }
};

const getProjectTypeLabel = (type: string) => {
  switch (type) {
    case "standalone":
      return "Standalone";
    case "vscode-integration":
      return "VS Code";
    case "existing-project":
      return "Existant";
    default:
      return type;
  }
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, setLocation] = useLocation();

  const handleEdit = () => {
    setLocation(`/editor/${project.id}`);
  };

  const handlePreview = () => {
    // Prévisualisation à implémenter dans une version future
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Project Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${getProjectGradient(project.type)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="w-16 h-3 bg-white bg-opacity-30 rounded mb-2"></div>
          <div className="w-12 h-2 bg-white bg-opacity-30 rounded"></div>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {getProjectTypeLabel(project.type)}
          </Badge>
        </div>
      </div>

      {/* Project Info */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {project.name}
          </h3>
        </div>
        
        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Modifié {formatDistanceToNow(new Date(project.updatedAt), { 
              addSuffix: true, 
              locale: fr 
            })}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-primary hover:text-blue-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Pages count */}
        {project.content?.pages && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{project.content.pages.length} page(s)</span>
              {project.template && (
                <span>Template: {project.template}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
