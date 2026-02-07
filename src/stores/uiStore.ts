import { create } from 'zustand';

type ResultsTab = 'metrics' | 'charts' | 'sensitivity';

interface UIState {
  sidebarOpen: boolean;
  resultsTab: ResultsTab;
  chartTimeRange: number;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setResultsTab: (tab: ResultsTab) => void;
  setChartTimeRange: (years: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  resultsTab: 'metrics',
  chartTimeRange: 5,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setResultsTab: (resultsTab) => set({ resultsTab }),
  setChartTimeRange: (chartTimeRange) => set({ chartTimeRange }),
}));
