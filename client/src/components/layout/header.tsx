import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && (
            <Badge variant="secondary" className="bg-secondary/10 text-secondary hidden sm:inline-flex">
              {subtitle}
            </Badge>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
