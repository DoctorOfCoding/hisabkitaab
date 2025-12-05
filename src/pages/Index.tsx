import { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { useLoanStore } from '@/hooks/useLoanStore';
import { Dashboard } from '@/components/Dashboard';
import { PersonList } from '@/components/PersonList';
import { PersonDetail } from '@/components/PersonDetail';
import { AddPersonDialog } from '@/components/AddPersonDialog';
import { SettingsSheet } from '@/components/SettingsSheet';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    isLoaded,
    addPerson,
    deletePerson,
    addTransaction,
    deleteTransaction,
    getPersonTransactions,
    calculatePersonBalance,
    getPersonsWithBalance,
    getDashboardStats,
    exportData,
    importData,
  } = useLoanStore();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showAddPerson, setShowAddPerson] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse">
          <Wallet className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  const personsWithBalance = getPersonsWithBalance();
  const dashboardStats = getDashboardStats();
  const selectedPerson = selectedPersonId ? calculatePersonBalance(selectedPersonId) : null;
  const selectedPersonTransactions = selectedPersonId ? getPersonTransactions(selectedPersonId) : [];

  // Show person detail view
  if (selectedPerson) {
    return (
      <PersonDetail
        person={selectedPerson}
        transactions={selectedPersonTransactions}
        onBack={() => setSelectedPersonId(null)}
        onAddTransaction={(type, amount, date, time, description) => {
          addTransaction(selectedPersonId!, type, amount, date, time, description);
        }}
        onDeleteTransaction={deleteTransaction}
        onDeletePerson={() => {
          deletePerson(selectedPersonId!);
          setSelectedPersonId(null);
        }}
      />
    );
  }

  // Show main dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Loan Manager</h1>
              <p className="text-xs text-muted-foreground">Track your loans</p>
            </div>
          </div>
          <SettingsSheet onExport={exportData} onImport={importData} />
        </div>
      </header>

      {/* Content */}
      <main className="p-4 pb-24 space-y-6">
        <Dashboard stats={dashboardStats} />
        <PersonList
          persons={personsWithBalance}
          onPersonClick={setSelectedPersonId}
          onAddPerson={() => setShowAddPerson(true)}
        />
      </main>

      {/* Floating Action Button */}
      <Button
        variant="floating"
        size="icon-lg"
        className="floating-action"
        onClick={() => setShowAddPerson(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Person Dialog */}
      <AddPersonDialog
        isOpen={showAddPerson}
        onClose={() => setShowAddPerson(false)}
        onAdd={addPerson}
      />
    </div>
  );
};

export default Index;
