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
    target_audience: "",
    documentation: "",
    contact_info: "",
    link: "",
    category: "",
    tags: "",
    icon: "",
  });
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const toolsUsingCategory = tools.filter(tool => tool.category === categoryName);
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

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalIconUrl = customIconUrl;

      if (iconFile) {
        const formData = new FormData();
        formData.append("file", iconFile);

        const uploadResponse = await fetch(`${API_BASE_URL}/upload-icon`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload icon");

        const uploadData = await uploadResponse.json();
        finalIconUrl = uploadData.url;
      }

      const toolData = {
        name: toolForm.name,
        short_description: toolForm.short_description,
        detailed_description: toolForm.detailed_description || undefined,
        target_audience: toolForm.target_audience || undefined,
        documentation: toolForm.documentation || undefined,
        contact_info: toolForm.contact_info || undefined,
        link: toolForm.link,
        category: toolForm.category,
        tags: toolForm.tags ? toolForm.tags.split(",").map((t) => t.trim()) : [],
        icon: finalIconUrl || toolForm.icon || undefined,
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
        target_audience: "",
        documentation: "",
        contact_info: "",
        link: "",
        category: "",
        tags: "",
        icon: "",
      });
      setCustomIconUrl("");
      setIconFile(null);

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
      setCustomIconUrl("");
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
                            <Badge variant="secondary" className="mt-1">
                              {tool.category}
                            </Badge>
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

                      <div className="space-y-2">
                        <Label htmlFor="tool-category">Kategori *</Label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Button
                              key={category}
                              type="button"
                              variant={toolForm.category === category ? "default" : "outline"}
                              size="sm"
                              onClick={() => setToolForm({ ...toolForm, category })}
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
                        <Label htmlFor="tool-audience">Målgruppe</Label>
                        <Input
                          id="tool-audience"
                          value={toolForm.target_audience}
                          onChange={(e) => setToolForm({ ...toolForm, target_audience: e.target.value })}
                          placeholder="Hvem er værktøjet til?"
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
                        <Label htmlFor="tool-tags">Tags (kommasepareret)</Label>
                        <Input
                          id="tool-tags"
                          value={toolForm.tags}
                          onChange={(e) => setToolForm({ ...toolForm, tags: e.target.value })}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Brugerdefineret ikon</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="flex-1"
                            />
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
                          <p className="text-xs text-muted-foreground">
                            Eller indtast URL til ikon
                          </p>
                          <Input
                            value={customIconUrl}
                            onChange={(e) => {
                              setCustomIconUrl(e.target.value);
                              setIconFile(null);
                            }}
                            placeholder="https://example.com/icon.png"
                            disabled={!!iconFile}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Opretter..." : "Opret værktøj"}
                      </Button>
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
