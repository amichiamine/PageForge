import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import TemplateGrid from "@/components/templates/template-grid";
import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import CreateTemplateModal from "@/components/templates/create-template-modal";
import type { Template } from "@shared/schema";

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const categories = [
    { id: "all", name: "Tous les templates" },
    { id: "landing", name: "Landing Pages" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "portfolio", name: "Portfolio" },
    { id: "blog", name: "Blog" },
    { id: "corporate", name: "Corporate" },
    { id: "personal", name: "Personnel" },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (template.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header 
        title="Templates"
        subtitle={`${templates.length} templates disponibles`}
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer un Template
          </Button>
        }
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredTemplates.length > 0 ? (
            <TemplateGrid templates={filteredTemplates} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Filter className="w-6 h-6 text-gray-400" />
                </div>
                {searchQuery || selectedCategory !== "all" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun template trouvé</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Essayez de modifier vos critères de recherche ou filtres
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun template</h3>
                    <p className="text-gray-600 text-center mb-4">
                      Il n'y a actuellement aucun template disponible
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer le premier template
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Featured Templates Section */}
          {!searchQuery && selectedCategory === "all" && templates.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Templates Populaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.filter(t => t.isBuiltIn).slice(0, 3).map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-sm opacity-90">{template.category}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full" size="sm">
                        Utiliser ce template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Template Modal */}
      <CreateTemplateModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </>
  );
}
