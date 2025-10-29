import { LucideIcon, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

interface ToolCardProps {
  icon?: string;
  name: string;
  description: string;
  link: string;
  category?: string;
  tags?: string[];
  onInfoClick: () => void;
}

export const ToolCard = ({ icon, name, description, link, category, tags, onInfoClick }: ToolCardProps) => {
  const handleCardClick = () => {
    if (link && link !== "#") {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInfoClick();
  };

  // Determine if icon is base64/URL or Lucide icon name
  const isDataUrlOrHttp = icon?.startsWith('data:') || icon?.startsWith('http') || icon?.startsWith('blob:');
  const isRawBase64 = icon && /^[A-Za-z0-9+/=]+$/.test(icon) && icon.length > 100;
  const resolvedImgSrc = isDataUrlOrHttp ? icon : isRawBase64 ? `data:image/png;base64,${icon}` : undefined;
  const IconComponent = !resolvedImgSrc && icon
    ? (Icons as any)[icon] || Icons.Wrench
    : Icons.Wrench;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-2 border-border/40 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98] flex flex-col"
      onClick={handleCardClick}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-background hover:scale-110 shadow-[var(--shadow-sm)]"
        onClick={handleInfoClick}
      >
        <Info className="h-4 w-4" />
      </Button>
      
      <div className="flex items-start gap-4 p-6 flex-1">
        <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-primary shadow-[var(--shadow-card)] transition-all duration-300 group-hover:shadow-[var(--shadow-card-hover)] group-hover:scale-110 flex items-center justify-center overflow-hidden">
          {resolvedImgSrc ? (
            <img src={resolvedImgSrc} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <IconComponent className="h-7 w-7 text-primary-foreground transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <CardTitle className="text-xl font-bold tracking-tight mb-2">{name}</CardTitle>
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </div>

      <div className="px-6 pb-4 pt-0">
        {(category || (tags && tags.length > 0)) && (
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <Badge variant="secondary" className="text-xs font-medium">
                {category}
              </Badge>
            )}
            {tags?.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
