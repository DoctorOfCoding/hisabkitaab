import { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentDate, getCurrentTime } from '@/lib/format';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    type: 'given' | 'taken',
    amount: number,
    date: string,
    time: string,
    description: string
  ) => void;
  personName: string;
}

export function AddTransactionDialog({ isOpen, onClose, onAdd, personName }: AddTransactionDialogProps) {
  const [type, setType] = useState<'given' | 'taken'>('taken');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getCurrentDate());
  const [time, setTime] = useState(getCurrentTime());
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onAdd(type, numAmount, date, time, description);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setType('taken');
    setAmount('');
    setDate(getCurrentDate());
    setTime(getCurrentTime());
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md glass-card p-6 m-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">New Transaction</h2>
            <p className="text-sm text-muted-foreground">with {personName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('taken')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                type === 'taken'
                  ? 'border-destructive bg-destructive/10'
                  : 'border-border bg-secondary hover:border-muted-foreground'
              }`}
            >
              <ArrowDownLeft className={`w-6 h-6 mx-auto mb-2 ${type === 'taken' ? 'text-destructive' : 'text-muted-foreground'}`} />
              <p className={`text-sm font-medium ${type === 'taken' ? 'text-destructive' : 'text-muted-foreground'}`}>
                I Borrowed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                I took money
              </p>
            </button>
            <button
              type="button"
              onClick={() => setType('given')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                type === 'given'
                  ? 'border-success bg-success/10'
                  : 'border-border bg-secondary hover:border-muted-foreground'
              }`}
            >
              <ArrowUpRight className={`w-6 h-6 mx-auto mb-2 ${type === 'given' ? 'text-success' : 'text-muted-foreground'}`} />
              <p className={`text-sm font-medium ${type === 'given' ? 'text-success' : 'text-muted-foreground'}`}>
                I Gave
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                I lent money
              </p>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Amount (Rs.)
            </label>
            <Input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary border-border text-lg font-mono"
              min="1"
              step="1"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              variant={type === 'given' ? 'success' : 'destructive'}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {type === 'taken' ? 'Record Borrowed' : 'Record Given'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
