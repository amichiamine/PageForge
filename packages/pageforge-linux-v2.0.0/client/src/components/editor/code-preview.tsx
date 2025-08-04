import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import type { Project, ComponentDefinition } from "@shared/schema";
import { exportProject } from "@/lib/export-utils";

interface CodePreviewProps {
  project: Project;
}

export default function CodePreview({ project }: CodePreviewProps) {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const files = exportProject(project, {
    includeCSS: true,
    includeJS: true,
    minify: false,
    inlineCSS: false,
    responsive: true,
    seoOptimized: true,
  });

  const copyToClipboard = async (content: string, fileName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLanguage = (type: string) => {
    switch (type) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      case 'json': return 'json';
      default: return 'text';
    }
  };

  if (files.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Aucun fichier à prévisualiser</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Code généré</h3>
        <p className="text-gray-400 text-sm">{files.length} fichier(s) exporté(s)</p>
      </div>

      <Tabs defaultValue={files[0]?.path} className="flex-1 flex flex-col">
        <TabsList className="m-4 bg-gray-800 border-gray-600">
          {files.map((file) => (
            <TabsTrigger 
              key={file.path} 
              value={file.path}
              className="data-[state=active]:bg-gray-700"
            >
              {file.path}
            </TabsTrigger>
          ))}
        </TabsList>

        {files.map((file) => (
          <TabsContent key={file.path} value={file.path} className="flex-1 m-0">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <span className="text-sm text-gray-400">
                  {file.path} ({getLanguage(file.type)})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(file.content, file.path)}
                  className="bg-gray-800 border-gray-600 hover:bg-gray-700"
                >
                  {copiedFile === file.path ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm text-gray-100 font-mono leading-relaxed">
                  <code className={`language-${getLanguage(file.type)}`}>
                    {file.content}
                  </code>
                </pre>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}