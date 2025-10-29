import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Upload, X, ArrowLeft } from "lucide-react";
import { Tool } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { ThemeToggle } from "@/components/ThemeToggle";
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

const Admin = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'tool' | 'category', id: string, name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"tools" | "categories">("tools");
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

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
  const [toolFormMessage, setToolFormMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);
  const [categoryFormMessage, setCategoryFormMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Category form state
  const [newCategoryName, setNewCategoryName] = useState("");

  // Properly manage blob URL for icon preview
  const previewBlobUrl = useMemo(() => 
    iconFile ? URL.createObjectURL(iconFile) : "", 
    [iconFile]
  );

  useEffect(() => {
    return () => {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    };
  }, [previewBlobUrl]);

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tools/${toolId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete tool");

      setToolFormMessage({
        type: 'success',
        text: 'Værktøjet blev slettet!'
      });
      setTimeout(() => setToolFormMessage(null), 3000);

      fetchTools();
    } catch (error) {
      console.error("Error deleting tool:", error);
      setToolFormMessage({
        type: 'error',
        text: 'Kunne ikke slette værktøjet. Prøv igen.'
      });
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    const toolsUsingCategory = tools.filter(tool => {
      const categories = tool.categories || [];
      return categories.includes(categoryName);
    });
    if (toolsUsingCategory.length > 0) {
      setCategoryFormMessage({
        type: 'error',
        text: `Kan ikke slette kategori: ${toolsUsingCategory.length} værktøj(er) bruger denne kategori. Slet eller opdater værktøjerne først.`
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/kategorier/${categoryName}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategoryFormMessage({
        type: 'success',
        text: 'Kategorien blev slettet!'
      });
      setTimeout(() => setCategoryFormMessage(null), 3000);

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setCategoryFormMessage({
        type: 'error',
        text: 'Kunne ikke slette kategorien. Prøv igen.'
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
            (element as HTMLElement).focus?.();
          }
          break;
        }
      }
      
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
      // If editing, delete the old tool first
      if (editingTool) {
        const deleteResponse = await fetch(`${API_BASE_URL}/tools/${encodeURIComponent(editingTool.name)}`, {
          method: "DELETE",
        });
        
        if (!deleteResponse.ok) {
          setToolFormMessage({
            type: 'error',
            text: 'Kunne ikke slette det gamle værktøj. Prøv igen.'
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Build icon as raw base64 (no data: prefix) only if a file was uploaded or a raw base64 was provided
      let iconBase64: string | undefined = undefined;

      if (iconFile) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(iconFile);
        });
        // Strip the data: prefix
        const commaIndex = dataUrl.indexOf(",");
        iconBase64 = commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : dataUrl;
      } else if (toolForm.icon && /^[A-Za-z0-9+/=]+$/.test(toolForm.icon) && toolForm.icon.length > 100) {
        // User pasted raw base64
        iconBase64 = toolForm.icon;
      }

      const toolData: Record<string, any> = {
        name: toolForm.name,
        short_description: toolForm.short_description,
        detailed_description: toolForm.detailed_description || undefined,
        documentation: toolForm.documentation || undefined,
        contact_info: toolForm.contact_info || undefined,
        link: toolForm.link,
        // Send all categories as array
        category: toolForm.categories,
      };

      if (iconBase64) toolData.icon = iconBase64;

      const response = await fetch(`${API_BASE_URL}/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toolData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Check if error is due to duplicate name
        if (response.status === 409 || errorData.message?.includes('already exists') || errorData.message?.includes('duplicate')) {
          setToolFormMessage({
            type: 'error',
            text: editingTool 
              ? `Kunne ikke opdatere: Et værktøj med navnet "${toolForm.name}" eksisterer allerede.`
              : `Værktøjet "${toolForm.name}" eksisterer allerede. Vælg et andet navn.`
          });
          
          // Scroll to name field
          const nameField = document.getElementById('tool-name');
          if (nameField) {
            nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nameField.focus();
          }
        } else {
          setToolFormMessage({
            type: 'error',
            text: editingTool 
              ? 'Værktøjet blev slettet, men den nye version kunne ikke oprettes. Prøv at oprette det igen.'
              : 'Kunne ikke oprette værktøjet. Prøv igen.'
          });
        }
        setIsSubmitting(false);
        return;
      }

      setToolFormMessage({
        type: 'success',
        text: editingTool ? 'Værktøjet blev opdateret!' : 'Værktøjet blev oprettet!'
      });
      setTimeout(() => setToolFormMessage(null), 3000);

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
      setEditingTool(null);

      fetchTools();
    } catch (error) {
      console.error("Error creating/updating tool:", error);
      setToolFormMessage({
        type: 'error',
        text: editingTool ? 'Kunne ikke opdatere værktøjet.' : 'Kunne ikke oprette værktøjet.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      setCategoryFormMessage({
        type: 'error',
        text: 'Kategorinavn må ikke være tomt.'
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 409 || errorData.message?.includes('already exists')) {
          setCategoryFormMessage({
            type: 'error',
            text: `Kategorien "${newCategoryName}" eksisterer allerede.`
          });
        } else {
          setCategoryFormMessage({
            type: 'error',
            text: 'Kunne ikke oprette kategorien. Prøv igen.'
          });
        }
        return;
      }

      setCategoryFormMessage({
        type: 'success',
        text: 'Kategorien blev oprettet!'
      });
      setTimeout(() => setCategoryFormMessage(null), 3000);

      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      setCategoryFormMessage({
        type: 'error',
        text: 'Kunne ikke oprette kategorien. Prøv igen.'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToolFormMessage({
          type: 'error',
          text: 'Fil for stor: Ikon må maksimalt være 5MB.'
        });
        return;
      }
      setIconFile(file);
    }
  };

  const handleToolClick = (tool: Tool) => {
    // Populate form with tool data
    setToolForm({
      name: tool.name,
      short_description: tool.short_description,
      detailed_description: tool.detailed_description || "",
      documentation: tool.documentation || "",
      contact_info: tool.contact_info || "",
      link: tool.link,
      categories: tool.categories || [],
      icon: tool.icon || "",
    });
    
    // Set editing mode
    setEditingTool(tool);
    
    // Clear any previous messages
    setToolFormMessage(null);
    setMissingFields([]);
    
    // Scroll to form
    const formSection = document.querySelector('[data-form-section="true"]');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingTool(null);
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
    setToolFormMessage(null);
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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Administrer værktøjer og kategorier</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                <Button
                  variant={activeTab === "tools" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("tools")}
                >
                  Værktøjer
                </Button>
                <Button
                  variant={activeTab === "categories" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("categories")}
                >
                  Kategorier
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-4 h-[calc(100vh-73px)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "tools" | "categories")} className="w-full">

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-0 h-full">
            <div className="grid grid-cols-[300px,1fr] gap-4 h-full">
              {/* Tool List - Compact */}
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Eksisterende værktøjer</h2>
                <ScrollArea className="h-[calc(100vh-145px)] rounded-lg border bg-card p-3">
                  <div className="space-y-2">
                    {tools.map((tool) => (
                      <div
                        key={tool.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                          editingTool?.name === tool.name 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-background hover:bg-accent/50'
                        }`}
                        onClick={() => handleToolClick(tool)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{tool.name}</p>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete('tool', tool.id, tool.name);
                          }}
                          className="ml-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {tools.length === 0 && (
                      <p className="text-muted-foreground text-center py-8 text-sm">
                        Ingen værktøjer endnu
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Create Tool Form - Maximized */}
              <div className="space-y-3" data-form-section="true">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {editingTool ? "Rediger værktøj" : "Opret nyt værktøj"}
                  </h2>
                  {editingTool && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-muted-foreground"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuller
                    </Button>
                  )}
                </div>
                
                <ScrollArea className="h-[calc(100vh-175px)] rounded-lg border bg-card">
                  {/* Sticky Preview at Top */}
                  <div className="sticky top-0 z-10 bg-card border-b p-6">
                    <p className="text-xs font-medium mb-3 text-muted-foreground">Forhåndsvisning:</p>
                    <div className="max-w-md">
                      <ToolCard
                        icon={previewBlobUrl || toolForm.icon || "Wrench"}
                        name={toolForm.name || "Værktøjsnavn"}
                        description={toolForm.short_description || "Beskrivelse af værktøjet..."}
                        link={toolForm.link || "#"}
                        category={toolForm.categories[0] || "Ingen kategori"}
                        tags={toolForm.categories.slice(1)}
                        onInfoClick={() => {}}
                      />
                    </div>
                  </div>
                  
                  <div className="p-6">
                  {/* Inline Message Display */}
                  {toolFormMessage && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      toolFormMessage.type === 'error' 
                        ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                        : 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
                    }`}>
                      <p className="text-sm font-medium">{toolFormMessage.text}</p>
                    </div>
                  )}
                  <form onSubmit={handleCreateTool} className="space-y-3">
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
                      <Label>Ikon</Label>
                      <div className="space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="tool-icon-name" className="text-xs text-muted-foreground">
                            Lucide ikon navn (f.eks. "Wrench", "Home", "Settings")
                          </Label>
                          <Input
                            id="tool-icon-name"
                            value={toolForm.icon}
                            onChange={(e) => setToolForm({ ...toolForm, icon: e.target.value })}
                            placeholder="Wrench"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">eller</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 h-10 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-[var(--shadow-sm)] hover:border-primary transition-colors">
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground text-sm">
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
                    </div>

                    <div className="relative group pt-1">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                        variant={!isFormValid ? "secondary" : "default"}
                        onMouseEnter={() => setMissingFields(computeMissingFields())}
                      >
                        {isSubmitting 
                          ? (editingTool ? "Opdaterer..." : "Opretter...") 
                          : (editingTool ? "Opdater værktøj" : "Opret værktøj")
                        }
                      </Button>
                      {!isFormValid && (
                        <div className="absolute left-0 right-0 -top-2 translate-y-[-100%] bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <p className="text-xs font-medium mb-1">Manglende felter:</p>
                          <ul className="text-xs space-y-0.5">
                            {computeMissingFields().map((field) => (
                              <li key={field}>• {field}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </form>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-0 h-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Category List */}
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Eksisterende kategorier</h2>
                <ScrollArea className="h-[calc(100vh-145px)] rounded-lg border bg-card p-3">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                      >
                        <p className="font-medium">{category}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete('category', category, category)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <p className="text-muted-foreground text-center py-8 text-sm">
                        Ingen kategorier endnu
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Create Category Form */}
              <div className="space-y-2">
                <h2 className="text-base font-semibold">Opret ny kategori</h2>
                <div className="rounded-lg border bg-card p-4">
                  {/* Inline Message Display */}
                  {categoryFormMessage && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      categoryFormMessage.type === 'error' 
                        ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                        : 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
                    }`}>
                      <p className="text-sm font-medium">{categoryFormMessage.text}</p>
                    </div>
                  )}
                  <form onSubmit={handleCreateCategory} className="space-y-3">
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
      </main>

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
    </div>
  );
};

export default Admin;
