export interface Person {
  id: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  personId: string;
  type: 'given' | 'taken'; // 'given' = I gave money, 'taken' = I borrowed money
  amount: number;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

export interface PersonWithBalance extends Person {
  totalGiven: number;      // Total I gave to this person
  totalTaken: number;      // Total I borrowed from this person
  totalReturned: number;   // Total returned (both ways)
  balance: number;         // Positive = I owe them, Negative = They owe me
  transactionCount: number;
}

export interface DashboardStats {
  totalPeople: number;
  totalOwedToMe: number;   // Sum of negative balances (they owe me)
  totalIOweThem: number;   // Sum of positive balances (I owe them)
}
