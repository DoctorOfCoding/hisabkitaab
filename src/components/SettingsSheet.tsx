import { useState, useRef } from 'react';
import { Settings, Download, Upload, FileJson, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

interface SettingsSheetProps {
  onExport: () => void;
  onImport: (jsonString: string) => boolean;
}

export function SettingsSheet({ onExport, onImport }: SettingsSheetProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        toast.success('Data imported successfully');
        setOpen(false);
      } else {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Data Management</h3>
            <p className="text-xs text-muted-foreground">
              Export or import your loan data for backup
            </p>
          </div>

          <button
            onClick={() => {
              onExport();
              toast.success('Data exported successfully');
            }}
            className="w-full glass-card p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Export Data</p>
              <p className="text-xs text-muted-foreground">Download as JSON file</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full glass-card p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Import Data</p>
              <p className="text-xs text-muted-foreground">Restore from JSON file</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <div className="pt-4 border-t border-border">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileJson className="w-5 h-5 text-primary" />
                <p className="font-medium text-foreground">About</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Loan Manager v1.0 - Track your loans and borrowings offline. All data is stored locally on your device.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
