import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { PersonWithBalance } from '@/types/loan';
import { formatCurrency } from '@/lib/format';

interface PersonCardProps {
  person: PersonWithBalance;
  onClick: () => void;
}

export function PersonCard({ person, onClick }: PersonCardProps) {
  const isPositive = person.balance < 0; // Negative balance means they owe me
  const displayBalance = Math.abs(person.balance);

  return (
    <button
      onClick={onClick}
      className="w-full glass-card p-4 flex items-center justify-between hover:bg-secondary/50 transition-all duration-200 animate-slide-up"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {person.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left">
          <h3 className="font-medium text-foreground">{person.name}</h3>
          <p className="text-xs text-muted-foreground">
            {person.transactionCount} transaction{person.transactionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          {person.balance === 0 ? (
            <p className="text-sm text-muted-foreground">Settled</p>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <p className={`font-semibold amount-display ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(displayBalance)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {isPositive ? 'To receive' : 'To pay'}
              </p>
            </>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </button>
  );
}
