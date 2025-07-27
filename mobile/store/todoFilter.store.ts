import { create } from 'zustand';

type DateFilter = 'today' | 'thisWeek' | 'all';
type PriorityFilter = 'low' | 'medium' | 'high' | 'all';

interface TodoFilterState {
  dateFilter: DateFilter;
  priorityFilter: PriorityFilter;
  searchQuery: string;
  setDateFilter: (filter: DateFilter) => void;
  setPriorityFilter: (filter: PriorityFilter) => void;
  setSearchQuery: (query: string) => void;
}

export const useTodoFilter = create<TodoFilterState>((set) => ({
  dateFilter: 'all',
  priorityFilter: 'all',
  searchQuery: '',
  setDateFilter: (filter) => set({ dateFilter: filter }),
  setPriorityFilter: (filter) => set({ priorityFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));