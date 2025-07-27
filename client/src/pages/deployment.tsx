import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Server, Upload, Settings, AlertCircle, CheckCircle } from "lucide-react";

export default function Deployment() {
  return (
    <>
      <Header 
        title="Déploiement"
        subtitle="Déployez vos projets sur l'hébergement web"
      />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Statut du déploiement
                  <Badge variant="secondary">En développement</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Fonctionnalité en cours de développement</p>
                    <p className="text-sm text-blue-700">Le déploiement automatique sera bientôt disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Options de déploiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Options de déploiement
                </CardTitle>
                <CardDescription>
                  Différentes méthodes pour déployer vos projets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold">Export manuel</h4>
                      <Badge variant="outline">Disponible</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Exportez les fichiers HTML/CSS/JS et uploadez-les via FTP ou cPanel
                    </p>
                    <Button size="sm" variant="outline">
                      Voir le guide
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold">Déploiement FTP</h4>
                      <Badge variant="secondary">Bientôt</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload direct via FTP avec configuration de serveur
                    </p>
                    <Button size="sm" variant="outline" disabled>
                      Configuration
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold">cPanel Integration</h4>
                      <Badge variant="secondary">Bientôt</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Intégration directe avec cPanel pour hébergement mutualisé
                    </p>
                    <Button size="sm" variant="outline" disabled>
                      Connecter cPanel
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold">Git Integration</h4>
                      <Badge variant="secondary">Bientôt</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Push automatique vers GitHub/GitLab pour déploiement continu
                    </p>
                    <Button size="sm" variant="outline" disabled>
                      Configurer Git
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guide d'export manuel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Guide d'export manuel
                </CardTitle>
                <CardDescription>
                  Étapes pour déployer manuellement vos projets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Exporter votre projet</h4>
                      <p className="text-sm text-gray-600">Utilisez le bouton "Exporter" dans l'éditeur pour télécharger les fichiers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Préparer les fichiers</h4>
                      <p className="text-sm text-gray-600">Organisez les fichiers HTML, CSS et JS dans votre dossier de projet</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Upload via FTP/cPanel</h4>
                      <p className="text-sm text-gray-600">Uploadez les fichiers dans le dossier public_html de votre hébergement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Tester le site</h4>
                      <p className="text-sm text-gray-600">Vérifiez que votre site fonctionne correctement sur votre domaine</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration hébergement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration hébergement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Hébergement mutualisé (cPanel)</h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Uploadez les fichiers dans <code>public_html/</code></li>
                      <li>• Assurez-vous que <code>index.html</code> est à la racine</li>
                      <li>• Vérifiez les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Serveur VPS/Dédié</h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Configurez un serveur web (Apache/Nginx)</li>
                      <li>• Pointez le document root vers vos fichiers</li>
                      <li>• Configurez les redirections si nécessaire</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}