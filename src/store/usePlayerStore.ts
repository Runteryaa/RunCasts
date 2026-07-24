import { create } from 'zustand';

interface PlayerState {
  isMiniPlayerVisible: boolean;
  currentPodcast: { id: string; title: string } | null;
  setMiniPlayerVisible: (visible: boolean) => void;
  setCurrentPodcast: (podcast: { id: string; title: string } | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isMiniPlayerVisible: false,
  currentPodcast: null,
  setMiniPlayerVisible: (visible) => set({ isMiniPlayerVisible: visible }),
  setCurrentPodcast: (podcast) => set({ currentPodcast: podcast }),
}));
