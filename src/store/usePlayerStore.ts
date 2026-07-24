import { create } from 'zustand';

interface PlayerState {
  isMiniPlayerVisible: boolean;
  isPlayerTabActive: boolean;
  currentPodcast: { id: string; title: string } | null;
  setMiniPlayerVisible: (visible: boolean) => void;
  setPlayerTabActive: (active: boolean) => void;
  setCurrentPodcast: (podcast: { id: string; title: string } | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isMiniPlayerVisible: false,
  isPlayerTabActive: false,
  currentPodcast: null,
  setMiniPlayerVisible: (visible) => set({ isMiniPlayerVisible: visible }),
  setPlayerTabActive: (active) => set({ isPlayerTabActive: active }),
  setCurrentPodcast: (podcast) => set({ currentPodcast: podcast }),
}));
