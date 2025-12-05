import { PersonWithBalance } from '@/types/loan';
import { PersonCard } from './PersonCard';
import { UserPlus } from 'lucide-react';

interface PersonListProps {
  persons: PersonWithBalance[];
  onPersonClick: (personId: string) => void;
  onAddPerson: () => void;
}

export function PersonList({ persons, onPersonClick, onAddPerson }: PersonListProps) {
  if (persons.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No People Yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start by adding someone to track loans
        </p>
        <button
          onClick={onAddPerson}
          className="text-primary font-medium hover:underline"
        >
          Add your first person
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-foreground">People</h2>
        <span className="text-sm text-muted-foreground">{persons.length} total</span>
      </div>
      <div className="space-y-2">
        {persons.map((person, index) => (
          <div key={person.id} style={{ animationDelay: `${index * 50}ms` }}>
            <PersonCard
              person={person}
              onClick={() => onPersonClick(person.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
