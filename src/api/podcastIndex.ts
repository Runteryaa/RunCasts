import CryptoJS from 'crypto-js';

// TODO: Replace with your actual Podcast Index credentials or use react-native-dotenv
const API_KEY = 'YOUR_API_KEY';
const API_SECRET = 'YOUR_API_SECRET';
const BASE_URL = 'https://api.podcastindex.org/api/1.0';

const getHeaders = () => {
  const apiHeaderTime = Math.floor(Date.now() / 1000).toString();
  const data4Hash = API_KEY + API_SECRET + apiHeaderTime;
  const hash = CryptoJS.SHA1(data4Hash).toString(CryptoJS.enc.Hex);

  return {
    'X-Auth-Date': apiHeaderTime,
    'X-Auth-Key': API_KEY,
    'Authorization': hash,
    'User-Agent': 'RunCasts/1.0'
  };
};

export const searchPodcasts = async (query: string) => {
  const url = `${BASE_URL}/search/byterm?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch from Podcast Index API');
  }
  
  return response.json();
};

export const getTrendingPodcasts = async () => {
  const url = `${BASE_URL}/podcasts/trending?max=20`;
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending podcasts');
  }
  
  return response.json();
};

export const getPodcastEpisodes = async (feedId: string) => {
  const url = `${BASE_URL}/episodes/byfeedid?id=${feedId}`;
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    throw new Error('Failed to fetch episodes');
  }
  
  return response.json();
};
