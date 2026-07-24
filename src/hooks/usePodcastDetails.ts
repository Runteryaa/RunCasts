import { useQuery } from '@tanstack/react-query';
import { storage } from '../store/mmkv';
import { getPodcastEpisodes } from '../api/podcastIndex';

const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

export const usePodcastDetails = (podcastId: string) => {
  return useQuery({
    queryKey: ['podcast', 'episodes', podcastId],
    queryFn: async () => {
      if (!podcastId) return { items: [] };

      const cacheKey = `cache_podcast_${podcastId}`;
      const cachedString = storage.getString(cacheKey);

      if (cachedString) {
        const cached = JSON.parse(cachedString);
        const now = Date.now();

        // 12 saat kuralı kontrolü
        if (now - cached.timestamp < TWELVE_HOURS_IN_MS) {
          return cached.data; // Cache hala geçerli
        }
      }

      // 12 saati geçmişse veya hiç yoksa, API'den yeni veri çek
      const data = await getPodcastEpisodes(podcastId);
      
      // Yeni veri ve timestamp'i MMKV'ye kaydet
      const newCacheObj = {
        timestamp: Date.now(),
        data,
      };
      storage.set(cacheKey, JSON.stringify(newCacheObj));

      return data;
    },
    enabled: !!podcastId,
  });
};
