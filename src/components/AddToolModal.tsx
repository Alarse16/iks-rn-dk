import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

// Hardcoded Base64 icon (your provided string)
const DEFAULT_ICON = "image/png;base64,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";

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  preselectedCategory?: string;
  onToolCreated: () => void;
}

const API_BASE_URL = "/api";

export const AddToolModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  onAddCategory, 
  preselectedCategory = "Værktøjer",
  onToolCreated
}: AddToolModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    detailed_description: "",
    target_audience: "",
    documentation: "",
    contact_info: "",
    link: "",
    category: preselectedCategory
  });
  const [customIconUrl, setCustomIconUrl] = useState<string>("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.short_description || !formData.link) {
      setShowValidation(true);
      
      // Scroll to first missing field
      setTimeout(() => {
        if (!formData.name) {
          const element = document.getElementById("tool-name");
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          element?.focus();
        } else if (!formData.short_description) {
          const element = document.getElementById("tool-short-description");
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          element?.focus();
        } else if (!formData.link) {
          const element = document.getElementById("tool-link");
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
          element?.focus();
        }
      }, 100);
      
      return;
    }
    
    setIsSubmitting(true);

    try {
      const iconValue = customIconUrl || DEFAULT_ICON;

      const payload = {
        name: formData.name,
        short_description: formData.short_description,
        detailed_description: formData.detailed_description || null,
        target_audience: formData.target_audience || null,
        documentation: formData.documentation || null,
        contact_info: formData.contact_info || null,
        link: formData.link,
        categories: formData.category ? [formData.category] : [],
        icon: iconValue,
      };

      const response = await fetch(`${API_BASE_URL}/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create tool");
      }

      toast({
        title: "Succes",
        description: "Værktøjet blev oprettet.",
      });
      
      setFormData({
        name: "",
        short_description: "",
        detailed_description: "",
        target_audience: "",
        documentation: "",
        contact_info: "",
        link: "",
        category: preselectedCategory
      });
      setCustomIconUrl("");
      setNewCategory("");
      setShowNewCategoryInput(false);
      setShowValidation(false);
      onToolCreated();
      onClose();
    } catch (error) {
      console.error("Error creating tool:", error);
      toast({
        title: "Fejl",
        description: error instanceof Error ? error.message : "Kunne ikke oprette værktøjet. Prøv igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomIconUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Fejl",
        description: "Kategorinavn må ikke være tomt.",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Fejl",
        description: `Kategorien "${newCategory.trim()}" eksisterer allerede.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/kategorier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409 || errorData.message?.includes('already exists')) {
          toast({
            title: "Fejl",
            description: `Kategorien "${newCategory.trim()}" eksisterer allerede.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fejl",
            description: "Kunne ikke oprette kategorien. Prøv igen.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Succes",
        description: "Kategorien blev oprettet!",
      });

      onAddCategory(newCategory.trim());
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory("");
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke oprette kategorien. Prøv igen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="relative z-20">
          <DialogTitle>Tilføj nyt værktøj</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name">Navn *</Label>
                {showValidation && !formData.name && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="relative z-10">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Du skal udfylde dette felt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Input
                id="tool-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Vises som overskrift på værktøjskortet"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="short_description">Kort beskrivelse *</Label>
                {showValidation && !formData.short_description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="relative z-10">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Du skal udfylde dette felt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Textarea
                id="tool-short-description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Vises på værktøjskortet under navnet"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailed_description">Detaljeret beskrivelse</Label>
              <Textarea
                id="detailed_description"
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Vises i info-vinduet når man klikker på værktøjet"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Målgruppe</Label>
              <Input
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                placeholder="Vises i info-vinduet - f.eks. 'Alle medarbejdere'"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentation">Dokumentation</Label>
              <Textarea
                id="documentation"
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                placeholder="Vises i info-vinduet - f.eks. vejledning til værktøjet"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_info">Kontakt information</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                placeholder="Vises i info-vinduet - f.eks. support@rn.dk eller 9932 1100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="link">Link *</Label>
                {showValidation && !formData.link && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="relative z-10">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Du skal udfylde dette felt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Input
                id="tool-link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="Bruges til 'Åben værktøj' knappen - f.eks. https://værktøj.rn.dk"
                required
              />
            </div>

            {/* ICON SECTION - ONLY UPLOAD OPTION */}
            <div className="space-y-2">
              <Label>Upload ikon (valgfrit)</Label>
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="icon-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('icon-upload')?.click()}
                  >
                    Vælg billede fra PC
                  </Button>
                </label>
                {customIconUrl && (
                  <div className="w-16 h-16 rounded-lg border-2 border-primary bg-background p-2 flex items-center justify-center">
                    <img src={customIconUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Hvis intet billede vælges, bruges standardikon.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <div className="flex gap-2">
                <div className="flex-1 flex flex-wrap gap-2">
                  {categories.filter(cat => cat !== "Alle").map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={formData.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({ ...formData, category })}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
                >
                  + Ny kategori
                </Button>
              </div>
              
              {showNewCategoryInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Ny kategori navn"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                  />
                  <Button type="button" onClick={handleAddCategory} size="sm">
                    Tilføj
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Annuller
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Opretter..." : "Tilføj værktøj"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};