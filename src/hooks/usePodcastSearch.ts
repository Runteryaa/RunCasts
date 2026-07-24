import { useQuery, useQueryClient } from '@tanstack/react-query';
import { storage } from '../store/mmkv';
import { searchPodcasts, getTrendingPodcasts } from '../api/podcastIndex';

export const usePodcastSearch = (query: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['podcasts', 'search', query],
    queryFn: async () => {
      if (!query) return { feeds: [] };

      const cacheKey = `cache_search_${query.toLowerCase()}`;
      
      // We will handle force refresh by invalidating the query from the UI,
      // but inside queryFn we check if we already have it in MMKV.
      const cachedData = storage.getString(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, fetch from API
      const data = await searchPodcasts(query);
      
      // Save to MMKV
      storage.set(cacheKey, JSON.stringify(data));
      
      return data;
    },
    enabled: true,
  });
};

export const useTrendingPodcasts = () => {
  return useQuery({
    queryKey: ['podcasts', 'trending'],
    queryFn: async () => {
      const cacheKey = 'cache_trending';
      const cachedData = storage.getString(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const data = await getTrendingPodcasts();
      storage.set(cacheKey, JSON.stringify(data));
      return data;
    },
  });
};

// Helper function to force refresh search
export const forceRefreshSearch = async (query: string, queryClient: any) => {
  if (!query) return;
  const cacheKey = `cache_search_${query.toLowerCase()}`;
  
  // Fetch fresh data
  const data = await searchPodcasts(query);
  
  // Update MMKV
  storage.set(cacheKey, JSON.stringify(data));
  
  // Update React Query cache
  queryClient.setQueryData(['podcasts', 'search', query], data);
};
