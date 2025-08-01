import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Personnalisez PageForge selon vos préférences
          </p>
        </div>

        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Thème</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Basculer entre le mode clair et sombre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Mode sombre</span>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Version</span>
                <Badge variant="outline">PageForge v2.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Statut</span>
                <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}