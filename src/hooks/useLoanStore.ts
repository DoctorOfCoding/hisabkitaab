import { useState, useEffect, useCallback } from 'react';
import { Person, Transaction, PersonWithBalance, DashboardStats } from '@/types/loan';

const STORAGE_KEYS = {
  PERSONS: 'loan_manager_persons',
  TRANSACTIONS: 'loan_manager_transactions',
};

export function useLoanStore() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPersons = localStorage.getItem(STORAGE_KEYS.PERSONS);
    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

    if (storedPersons) {
      setPersons(JSON.parse(storedPersons));
    }
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    setIsLoaded(true);
  }, []);

  // Persist persons to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
    }
  }, [persons, isLoaded]);

  // Persist transactions to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  // Add a new person
  const addPerson = useCallback((name: string) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setPersons(prev => [...prev, newPerson]);
    return newPerson;
  }, []);

  // Delete a person and their transactions
  const deletePerson = useCallback((personId: string) => {
    setPersons(prev => prev.filter(p => p.id !== personId));
    setTransactions(prev => prev.filter(t => t.personId !== personId));
  }, []);

  // Add a transaction
  const addTransaction = useCallback((
    personId: string,
    type: 'given' | 'taken',
    amount: number,
    date: string,
    time: string,
    description: string
  ) => {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      personId,
      type,
      amount,
      date,
      time,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  }, []);

  // Delete a transaction
  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  }, []);

  // Get transactions for a specific person
  const getPersonTransactions = useCallback((personId: string) => {
    return transactions
      .filter(t => t.personId === personId)
      .sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB.getTime() - dateTimeA.getTime();
      });
  }, [transactions]);

  // Calculate balance for a person
  // Balance = (Total Taken/Borrowed) - (Total Given)
  // Positive = I owe them, Negative = They owe me
  const calculatePersonBalance = useCallback((personId: string): PersonWithBalance | null => {
    const person = persons.find(p => p.id === personId);
    if (!person) return null;

    const personTransactions = transactions.filter(t => t.personId === personId);
    
    let totalGiven = 0;  // Money I gave to them
    let totalTaken = 0;  // Money I borrowed from them

    personTransactions.forEach(t => {
      if (t.type === 'given') {
        totalGiven += t.amount;
      } else {
        totalTaken += t.amount;
      }
    });

    // Balance calculation:
    // Positive balance = I borrowed more than I gave = I owe them
    // Negative balance = I gave more than I borrowed = They owe me
    const balance = totalTaken - totalGiven;

    return {
      ...person,
      totalGiven,
      totalTaken,
      totalReturned: 0, // We track this through transactions
      balance,
      transactionCount: personTransactions.length,
    };
  }, [persons, transactions]);

  // Get all persons with their balances
  const getPersonsWithBalance = useCallback((): PersonWithBalance[] => {
    return persons
      .map(p => calculatePersonBalance(p.id))
      .filter((p): p is PersonWithBalance => p !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [persons, calculatePersonBalance]);

  // Get dashboard stats
  const getDashboardStats = useCallback((): DashboardStats => {
    const personsWithBalance = getPersonsWithBalance();
    
    let totalOwedToMe = 0;
    let totalIOweThem = 0;

    personsWithBalance.forEach(p => {
      if (p.balance > 0) {
        totalIOweThem += p.balance;
      } else {
        totalOwedToMe += Math.abs(p.balance);
      }
    });

    return {
      totalPeople: persons.length,
      totalOwedToMe,
      totalIOweThem,
    };
  }, [persons.length, getPersonsWithBalance]);

  // Export data as JSON
  const exportData = useCallback(() => {
    const data = {
      persons,
      transactions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [persons, transactions]);

  // Import data from JSON
  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.persons && Array.isArray(data.persons)) {
        setPersons(data.persons);
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }, []);

  // Get person by ID
  const getPersonById = useCallback((personId: string) => {
    return persons.find(p => p.id === personId);
  }, [persons]);

  return {
    persons,
    transactions,
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
    getPersonById,
  };
}
