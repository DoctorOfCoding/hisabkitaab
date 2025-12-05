import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { PersonWithBalance } from '@/types/loan';
import { formatCurrency } from '@/lib/format';

interface BalanceSummaryProps {
  person: PersonWithBalance;
}

export function BalanceSummary({ person }: BalanceSummaryProps) {
  const isPositive = person.balance < 0; // Negative balance means they owe me
  const displayBalance = Math.abs(person.balance);

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Main Balance */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
        {person.balance === 0 ? (
          <p className="text-3xl font-bold text-muted-foreground">Settled</p>
        ) : (
          <>
            <p className={`text-4xl font-bold amount-display ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(displayBalance)}
            </p>
            <p className={`text-sm mt-2 ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive 
                ? `${person.name} owes you this amount` 
                : `You owe ${person.name} this amount`}
            </p>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-success/10 rounded-lg p-4 text-center">
          <TrendingUp className="w-5 h-5 text-success mx-auto mb-2" />
          <p className="text-lg font-semibold amount-display text-success">
            {formatCurrency(person.totalGiven)}
          </p>
          <p className="text-xs text-muted-foreground">Total Given</p>
        </div>
        <div className="bg-destructive/10 rounded-lg p-4 text-center">
          <TrendingDown className="w-5 h-5 text-destructive mx-auto mb-2" />
          <p className="text-lg font-semibold amount-display text-destructive">
            {formatCurrency(person.totalTaken)}
          </p>
          <p className="text-xs text-muted-foreground">Total Borrowed</p>
        </div>
      </div>
    </div>
  );
}
