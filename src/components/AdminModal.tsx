import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tool } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE_URL = "https://10.253.129.201:4300";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  availableCategories: string[];
}

export const AdminModal = ({ isOpen, onClose, onRefresh, availableCategories }: AdminModalProps) => {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'tool' | 'category', id: string, name: string } | null>(null);

  // Tool form state
  const [toolForm, setToolForm] = useState({
    name: "",
    short_description: "",
    detailed_description: "",
    documentation: "",
    contact_info: "",
    link: "",
    categories: [] as string[],
    icon: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Category form state
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTools();
      fetchCategories();
    }
  }, [isOpen]);

  const fetchTools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tools`);
      if (!response.ok) throw new Error("Failed to fetch tools");
      const data = await response.json();
      const toolsWithId = data.map((tool: any) => ({
        ...tool,
        id: tool.name,
      }));
      setTools(toolsWithId);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke hente værktøjer",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/kategorier`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke hente kategorier",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tools/${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete tool");

      toast({
        title: "Succes",
        description: "Værktøjet blev slettet",
      });

      fetchTools();
      onRefresh();
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke slette værktøjet",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    // Check if any tools use this category
    const toolsUsingCategory = tools.filter(tool => {
      const categories = tool.categories || [];
      return categories.includes(categoryName);
    });
    if (toolsUsingCategory.length > 0) {
      toast({
        title: "Kan ikke slette kategori",
        description: `${toolsUsingCategory.length} værktøj(er) bruger denne kategori. Slet eller opdater værktøjerne først.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/kategorier/${categoryName}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast({
        title: "Succes",
        description: "Kategorien blev slettet",
      });

      fetchCategories();
      onRefresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke slette kategorien",
        variant: "destructive",
      });
    }
  };

  const computeMissingFields = () => {
    const missing: string[] = [];
    if (!toolForm.name.trim()) missing.push("Navn");
    if (!toolForm.short_description.trim()) missing.push("Kort beskrivelse");
    if (!toolForm.link.trim()) missing.push("Link");
    if (toolForm.categories.length === 0) missing.push("Kategori");
    return missing;
  };

  const isFormValid = computeMissingFields().length === 0;

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missing = computeMissingFields();
    setMissingFields(missing);
    
    if (missing.length > 0) {
      // Scroll to first empty required field
      const fieldIds = ["tool-name", "tool-short-desc", "tool-link"];
      const fieldChecks = [
        !toolForm.name.trim(),
        !toolForm.short_description.trim(),
        !toolForm.link.trim(),
      ];
      
      for (let i = 0; i < fieldChecks.length; i++) {
        if (fieldChecks[i]) {
          const element = document.getElementById(fieldIds[i]);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.focus();
          }
          break;
        }
      }
      
      // Check categories last
      if (toolForm.categories.length === 0) {
        const categorySection = document.getElementById("tool-category-section");
        if (categorySection) {
          categorySection.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert icon file to base64 if provided
      let finalIconUrl = toolForm.icon;
      
      if (iconFile) {
        const reader = new FileReader();
        finalIconUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(iconFile);
        });
      }

      const toolData = {
        name: toolForm.name,
        short_description: toolForm.short_description,
        detailed_description: toolForm.detailed_description || undefined,
        documentation: toolForm.documentation || undefined,
        contact_info: toolForm.contact_info || undefined,
        link: toolForm.link,
        categories: toolForm.categories,
        icon: finalIconUrl || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) throw new Error("Failed to create tool");

      toast({
        title: "Succes",
        description: "Værktøjet blev oprettet",
      });

      // Reset form
      setToolForm({
        name: "",
        short_description: "",
        detailed_description: "",
        documentation: "",
        contact_info: "",
        link: "",
        categories: [],
        icon: "",
      });
      setIconFile(null);
      setMissingFields([]);

      fetchTools();
      onRefresh();
    } catch (error) {
      console.error("Error creating tool:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke oprette værktøjet",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast({
        title: "Fejl",
        description: "Kategorinavn må ikke være tomt",
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
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast({
        title: "Succes",
        description: "Kategorien blev oprettet",
      });

      setNewCategoryName("");
      fetchCategories();
      onRefresh();
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke oprette kategorien",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fil for stor",
          description: "Ikon må maksimalt være 5MB",
          variant: "destructive",
        });
        return;
      }
      setIconFile(file);
    }
  };

  const confirmDelete = (type: 'tool' | 'category', id: string, name: string) => {
    setItemToDelete({ type, id, name });
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'tool') {
      handleDeleteTool(itemToDelete.id);
    } else {
      handleDeleteCategory(itemToDelete.id);
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Administrer værktøjer og kategorier</DialogTitle>
            <DialogDescription>
              Opret, rediger og slet værktøjer og kategorier
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">Værktøjer</TabsTrigger>
              <TabsTrigger value="categories">Kategorier</TabsTrigger>
            </TabsList>

            {/* Tools Tab */}
            <TabsContent value="tools" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Eksisterende værktøjer</h3>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    <div className="space-y-2">
                      {tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{tool.name}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {(tool.categories || []).map((cat) => (
                                <Badge key={cat} variant="secondary" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete('tool', tool.id, tool.name)}
                            className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {tools.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          Ingen værktøjer endnu
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Create Tool Form */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Opret nyt værktøj</h3>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    {/* Sticky Preview Card */}
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-4 border-b">
                      <p className="text-sm font-medium mb-2 text-muted-foreground">Forhåndsvisning:</p>
                      <ToolCard
                        icon={
                          iconFile 
                            ? URL.createObjectURL(iconFile) 
                            : toolForm.icon || "Wrench"
                        }
                        name={toolForm.name || "Værktøjsnavn"}
                        description={toolForm.short_description || "Beskrivelse af værktøjet..."}
                        link={toolForm.link || "#"}
                        category={toolForm.categories[0] || "Ingen kategori"}
                        tags={toolForm.categories.slice(1)}
                        onInfoClick={() => {}}
                      />
                    </div>
                    
                    <form onSubmit={handleCreateTool} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tool-name">Navn *</Label>
                        <Input
                          id="tool-name"
                          value={toolForm.name}
                          onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                          placeholder="Værktøjets navn"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tool-short-desc">Kort beskrivelse *</Label>
                        <Textarea
                          id="tool-short-desc"
                          value={toolForm.short_description}
                          onChange={(e) => setToolForm({ ...toolForm, short_description: e.target.value })}
                          placeholder="Kort beskrivelse af værktøjet"
                          required
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tool-detailed-desc">Detaljeret beskrivelse</Label>
                        <Textarea
                          id="tool-detailed-desc"
                          value={toolForm.detailed_description}
                          onChange={(e) => setToolForm({ ...toolForm, detailed_description: e.target.value })}
                          placeholder="Detaljeret beskrivelse"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2" id="tool-category-section">
                        <Label htmlFor="tool-category">Kategorier * (vælg en eller flere)</Label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Button
                              key={category}
                              type="button"
                              variant={toolForm.categories.includes(category) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                setToolForm({
                                  ...toolForm,
                                  categories: toolForm.categories.includes(category)
                                    ? toolForm.categories.filter(c => c !== category)
                                    : [...toolForm.categories, category]
                                });
                              }}
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tool-link">Link *</Label>
                        <Input
                          id="tool-link"
                          value={toolForm.link}
                          onChange={(e) => setToolForm({ ...toolForm, link: e.target.value })}
                          placeholder="https://..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tool-docs">Dokumentation</Label>
                        <Textarea
                          id="tool-docs"
                          value={toolForm.documentation}
                          onChange={(e) => setToolForm({ ...toolForm, documentation: e.target.value })}
                          placeholder="Hvordan bruges værktøjet?"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tool-contact">Kontaktinfo</Label>
                        <Input
                          id="tool-contact"
                          value={toolForm.contact_info}
                          onChange={(e) => setToolForm({ ...toolForm, contact_info: e.target.value })}
                          placeholder="support@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload ikon</Label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm shadow-[var(--shadow-sm)] hover:border-primary transition-colors">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {iconFile ? iconFile.name : "Upload billede"}
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                          {iconFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setIconFile(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="relative group">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                          variant={!isFormValid ? "secondary" : "default"}
                          onMouseEnter={() => setMissingFields(computeMissingFields())}
                        >
                          {isSubmitting ? "Opretter..." : "Opret værktøj"}
                        </Button>
                        {!isFormValid && (
                          <div className="absolute left-0 right-0 -top-2 translate-y-[-100%] bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <p className="text-sm font-medium mb-1">Manglende felter:</p>
                            <ul className="text-xs space-y-0.5">
                              {computeMissingFields().map((field) => (
                                <li key={field}>• {field}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </form>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category List */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Eksisterende kategorier</h3>
                  <ScrollArea className="h-[500px] rounded-md border p-4">
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <p className="font-medium">{category}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete('category', category, category)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {categories.length === 0 && (
                        <p className="text-muted-foreground text-center py-8">
                          Ingen kategorier endnu
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Create Category Form */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Opret ny kategori</h3>
                  <div className="rounded-md border p-4">
                    <form onSubmit={handleCreateCategory} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Kategorinavn *</Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Indtast kategorinavn"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Opret kategori
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'tool' 
                ? `Du er ved at slette værktøjet "${itemToDelete?.name}". Denne handling kan ikke fortrydes.`
                : `Du er ved at slette kategorien "${itemToDelete?.name}". Denne handling kan ikke fortrydes.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive hover:bg-destructive/90">
              Slet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
