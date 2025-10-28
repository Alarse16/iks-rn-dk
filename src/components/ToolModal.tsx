import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (toolId: string) => void;
  tool: {
    id: string;
    name: string;
    short_description: string;
    detailed_description?: string;
    target_audience?: string;
    documentation?: string;
    contact_info?: string;
  } | null;
}

export const ToolModal = ({ isOpen, onClose, onDelete, tool }: ToolModalProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!tool) return null;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "rød" && password === "bro") {
      if (onDelete) {
        onDelete(tool.id);
      }
      setShowDeleteDialog(false);
      setUsername("");
      setPassword("");
      setError("");
      onClose();
    } else {
      setError("Forkert brugernavn eller adgangskode");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 shadow-[var(--shadow-modal)]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {tool.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {tool.short_description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-6 max-h-[calc(85vh-120px)]">
          <div className="space-y-6">
            {tool.detailed_description && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Formål og fordele</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {tool.detailed_description}
                </p>
              </div>
            )}

            {tool.target_audience && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Målgruppe</h3>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {tool.target_audience}
                </Badge>
              </div>
            )}

            {tool.documentation && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Dokumentation</h3>
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {tool.documentation}
                  </div>
                </div>
              </div>
            )}

            {tool.contact_info && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Kontakt</h3>
                <div className="bg-accent/50 rounded-lg p-4 border border-accent">
                  <p className="text-sm text-accent-foreground leading-relaxed">
                    {tool.contact_info}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Slet værktøj
            </Button>
          </div>
        </ScrollArea>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log ind for at slette værktøj</AlertDialogTitle>
              <AlertDialogDescription>
                Indtast dine loginoplysninger for at bekræfte sletning af "{tool.name}"
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form onSubmit={handleDeleteConfirm} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="delete-username">Brugernavn</Label>
                <Input
                  id="delete-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Indtast brugernavn"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delete-password">Adgangskode</Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Indtast adgangskode"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelDelete}>
                  Annuller
                </Button>
                <Button type="submit" variant="destructive">
                  Slet
                </Button>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
