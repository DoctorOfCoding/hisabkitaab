import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddPersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export function AddPersonDialog({ isOpen, onClose, onAdd }: AddPersonDialogProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md glass-card p-6 m-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Add Person</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Person Name
            </label>
            <Input
              type="text"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-secondary border-border"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim()}>
              Add Person
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
