import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/loan';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Button } from '@/components/ui/button';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: () => void;
}

export function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const isTaken = transaction.type === 'taken';

  return (
    <div className="glass-card p-4 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTaken ? 'bg-destructive/20' : 'bg-success/20'
          }`}>
            {isTaken ? (
              <ArrowDownLeft className="w-5 h-5 text-destructive" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-success" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isTaken ? 'Borrowed' : 'Given'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(transaction.date, transaction.time)}
            </p>
            {transaction.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {transaction.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className={`font-semibold amount-display ${isTaken ? 'text-destructive' : 'text-success'}`}>
            {isTaken ? '-' : '+'}{formatCurrency(transaction.amount)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
