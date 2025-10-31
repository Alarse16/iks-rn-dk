import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToolCard } from "@/components/ToolCard";
import { ToolModal } from "@/components/ToolModal";
import { AuthModal } from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Tool } from "@/data/tools";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "";

const Index = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔧 Env:", {
      origin: window.location.origin,
      API_BASE_URL,
      online: navigator.onLine,
    });
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const toolsUrl = `${API_BASE_URL}/tools`;
      const t0 = performance.now();
      console.log("🔄 Starting to fetch tools from:", toolsUrl);
      setIsLoading(true);
      
      const response = await fetch(toolsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const t1 = performance.now();
      console.log("⏱️ Tools fetch duration:", Math.round(t1 - t0), "ms");
      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response not OK. Status:", response.status, "Body:", errorText);
        throw new Error(`Failed to fetch tools: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log("✅ Fetched data:", data);
      console.log("✅ Number of tools:", data.length);
      
      // Add id field for frontend compatibility (API doesn't return id).
      const toolsWithId = data.map((tool: any) => ({
        ...tool,
        id: tool.name, // Use name as id since it's unique
        // Normalize categories: prefer API 'categories' array, fall back to legacy 'category'
        categories: Array.isArray(tool?.categories)
          ? tool.categories
          : Array.isArray(tool?.category)
            ? tool.category
            : (typeof tool?.category === "string" && tool.category.trim().length > 0
                ? [tool.category]
                : [])
      }));
      
      console.log("✅ Tools with IDs:", toolsWithId);
      setTools(toolsWithId);
      console.log("✅ Successfully loaded", toolsWithId.length, "tools");
    } catch (error) {
      console.error("❌ Error fetching tools:", error);
      console.error("❌ Error type:", error instanceof TypeError ? "TypeError (likely CORS or network)" : typeof error);
      console.error("❌ Error message:", error instanceof Error ? error.message : String(error));
      console.error("❌ Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      toast({
        title: "Fejl",
        description: "Kunne ikke hente værktøjer. Kontakt IT-support hvis problemet fortsætter.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("🏁 Fetch tools completed");
    }
  };

  const fetchCategories = async () => {
    try {
      const catUrl = `${API_BASE_URL}/kategorier`;
      const c0 = performance.now();
      console.log("🔄 Starting to fetch categories from:", catUrl);
      
      const response = await fetch(catUrl, { method: 'GET' });
      
      const c1 = performance.now();
      console.log("⏱️ Categories fetch duration:", Math.round(c1 - c0), "ms");
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "<no body>");
        console.error("❌ Categories not OK:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          bodySnippet: errorText.slice(0, 500),
        });
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      // Add "Alle" as first option for frontend filtering
      setCategories(data);
      console.log("✅ Successfully loaded categories:", data);
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke hente kategorier. Kontakt IT-support hvis problemet fortsætter.",
        variant: "destructive",
      });
    }
  };

  const handleInfoClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTool(null), 300);
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tools/${toolId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete tool: ${response.status}`);
      }

      toast({
        title: "Succes",
        description: "Værktøjet blev slettet.",
      });

      fetchTools();
    } catch (error) {
      console.error("❌ Error deleting tool:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke slette værktøjet. Prøv igen.",
        variant: "destructive",
      });
    }
  };

  const handleOpenAdmin = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthenticated = () => {
    setIsAuthModalOpen(false);
    navigate("/admin");
  };

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const toolCategories = tool.categories || [];
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.every(cat => toolCategories.includes(cat));
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Top Section (Not Sticky) */}
      <div className="border-b-2 border-border/50 bg-card/95 backdrop-blur-md shadow-[var(--shadow-sm)]">
        <div className="container mx-auto px-4 py-3">
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center p-2">
              <img src="/rn-logo.svg" alt="Region Nordjylland" className="h-24" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">IKS.rn.dk</h1>
              <p className="text-xl font-medium text-foreground/90">Infrastruktur & Klient Services</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Search Section (Sticky) */}
      <header className="sticky top-0 z-40 border-b-2 border-border/50 bg-card/80 backdrop-blur-xl shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Search Bar - Centered */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Søg efter værktøjer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base shadow-[var(--shadow-card)]"
              />
            </div>
          </div>

          {/* Category Filters - Below Search */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="whitespace-nowrap transition-all duration-200 border-2 hover:scale-100 active:scale-100"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-16 pt-8">
        {isLoading ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground text-lg font-medium">Henter værktøjer...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-muted-foreground text-lg font-medium">Ingen værktøjer fundet. Prøv en anden søgning.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                icon={tool.icon || "Wrench"}
                name={tool.name}
                description={tool.short_description}
                link={tool.link}
                category={tool.categories?.[0] || "Ingen kategori"}
                tags={tool.categories?.slice(1) || []}
                onInfoClick={() => handleInfoClick(tool)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Admin Button */}
      <Button 
        onClick={handleOpenAdmin} 
        size="lg" 
        className="fixed bottom-6 right-6 z-50 gap-2 shadow-2xl hover:shadow-[var(--shadow-card-hover)]"
      >
        <Plus className="h-5 w-5" />
        Administrer værktøjer
      </Button>

      {/* Footer */}
      <footer className="border-t-2 border-border/50 bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center text-sm text-muted-foreground space-y-3">
            <p className="text-base">
              <strong className="text-foreground font-bold text-lg">Infrastruktur og Klient Platform</strong>
              <span className="block mt-1 text-muted-foreground">Region Nordjylland</span>
            </p>
            <p className="max-w-xl mx-auto">
              Har du spørgsmål eller behov for support? Kontakt IT-support på{" "}
              <a href="tel:99321100" className="text-primary hover:text-primary-glow font-medium transition-colors duration-200 hover:underline">
                9932 1100
              </a>
              {" "}eller{" "}
              <a href="mailto:it-support@rn.dk" className="text-primary hover:text-primary-glow font-medium transition-colors duration-200 hover:underline">
                it-support@rn.dk
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Tool Modal */}
      <ToolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteTool}
        tool={selectedTool}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticated}
      />
    </div>
  );
};

export default Index;