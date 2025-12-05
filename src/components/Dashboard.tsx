import { Users, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { DashboardStats } from '@/types/loan';
import { formatCurrency } from '@/lib/format';

interface DashboardProps {
  stats: DashboardStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const netBalance = stats.totalOwedToMe - stats.totalIOweThem;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Net Balance Card */}
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Net Balance</p>
        <p className={`text-4xl font-bold amount-display ${netBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
          {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {netBalance > 0 ? 'Others owe you' : netBalance < 0 ? 'You owe others' : 'All settled'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="People"
          value={stats.totalPeople.toString()}
          variant="default"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="To Receive"
          value={formatCurrency(stats.totalOwedToMe)}
          variant="success"
        />
        <StatCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="To Pay"
          value={formatCurrency(stats.totalIOweThem)}
          variant="danger"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: 'default' | 'success' | 'danger';
}

function StatCard({ icon, label, value, variant }: StatCardProps) {
  const variantClasses = {
    default: 'text-primary',
    success: 'text-success',
    danger: 'text-destructive',
  };

  return (
    <div className="glass-card p-4 text-center">
      <div className={`flex justify-center mb-2 ${variantClasses[variant]}`}>
        {icon}
      </div>
      <p className={`text-lg font-semibold amount-display ${variantClasses[variant]}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
