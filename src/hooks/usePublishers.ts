import * as rssParser from 'react-native-rss-parser';
import { useQuery } from '@tanstack/react-query';

// Manuel olarak seçilmiş "RunCasts Yayıncıları" RSS feed'leri
const PUBLISHER_FEEDS = [
  'https://feeds.simplecast.com/qm_9xx0g', // Örnek feed (Syntax FM)
  'https://feeds.npr.org/510289/podcast.xml' // Örnek feed (Planet Money)
];

export const usePublishers = () => {
  return useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const results = [];
      for (const url of PUBLISHER_FEEDS) {
        try {
          const res = await fetch(url);
          const text = await res.text();
          const parsed = await rssParser.parse(text);
          
          results.push({
            id: url, // url'i unique ID olarak kullanıyoruz
            title: parsed.title,
            description: parsed.description,
            image: parsed.image ? parsed.image.url : null,
            author: parsed.authors && parsed.authors.length > 0 ? parsed.authors[0].name : '',
            items: parsed.items
          });
        } catch (error) {
          console.warn(`Failed to parse feed: ${url}`, error);
        }
      }
      return results;
    }
  });
};
