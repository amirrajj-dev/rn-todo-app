import { create } from 'zustand';

type StateFilter = 'seen' | 'notSeen' | 'all';

interface TodoFilterState {
  stateFilter : StateFilter;
  setStateFilter : (value : StateFilter)=>void
}

export const useNotificationFilter = create<TodoFilterState>((set) => ({
  stateFilter : "all" ,
  setStateFilter : (value) => set({ stateFilter : value })
}));