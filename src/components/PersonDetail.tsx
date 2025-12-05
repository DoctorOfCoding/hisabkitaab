import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PersonWithBalance, Transaction } from '@/types/loan';
import { Button } from '@/components/ui/button';
import { BalanceSummary } from './BalanceSummary';
import { TransactionItem } from './TransactionItem';
import { AddTransactionDialog } from './AddTransactionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PersonDetailProps {
  person: PersonWithBalance;
  transactions: Transaction[];
  onBack: () => void;
  onAddTransaction: (
    type: 'given' | 'taken',
    amount: number,
    date: string,
    time: string,
    description: string
  ) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onDeletePerson: () => void;
}

export function PersonDetail({
  person,
  transactions,
  onBack,
  onAddTransaction,
  onDeleteTransaction,
  onDeletePerson,
}: PersonDetailProps) {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [showDeletePerson, setShowDeletePerson] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{person.name}</h1>
              <p className="text-xs text-muted-foreground">
                {person.transactionCount} transactions
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeletePerson(true)}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-24 space-y-6">
        <BalanceSummary person={person} />

        {/* Transactions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1">
            Transaction History
          </h2>
          {transactions.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="text-primary font-medium hover:underline mt-2"
              >
                Add your first transaction
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction, index) => (
                <div key={transaction.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <TransactionItem
                    transaction={transaction}
                    onDelete={() => setTransactionToDelete(transaction.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        variant="floating"
        size="icon-lg"
        className="floating-action"
        onClick={() => setShowAddTransaction(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onAdd={onAddTransaction}
        personName={person.name}
      />

      {/* Delete Transaction Confirmation */}
      <AlertDialog open={!!transactionToDelete} onOpenChange={() => setTransactionToDelete(null)}>
        <AlertDialogContent className="glass-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The transaction will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (transactionToDelete) {
                  onDeleteTransaction(transactionToDelete);
                  setTransactionToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Person Confirmation */}
      <AlertDialog open={showDeletePerson} onOpenChange={setShowDeletePerson}>
        <AlertDialogContent className="glass-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {person.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {person.name} and all their transactions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDeletePerson();
                setShowDeletePerson(false);
              }}
            >
              Delete Person
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
