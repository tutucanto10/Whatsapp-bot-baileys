import axios from 'axios';
import Logger from '../utils/logger.js';

class SearchService {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  }

  // Busca no Google
  async google(query, limit = 5) {
    try {
      // Usando API alternativa gratuita
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: 'YOUR_GOOGLE_API_KEY', // Substitua ou use alternativa
          cx: 'YOUR_SEARCH_ENGINE_ID',
          q: query,
          num: limit
        }
      });

      if (response.data.items) {
        return response.data.items.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet
        }));
      }

      // Fallback: busca simplificada
      return this.fallbackGoogleSearch(query);
    } catch (error) {
      Logger.error('Erro na busca Google:', error);
      return this.fallbackGoogleSearch(query);
    }
  }

  fallbackGoogleSearch(query) {
    const encodedQuery = encodeURIComponent(query);
    return [{
      title: `Resultados para: ${query}`,
      link: `https://www.google.com/search?q=${encodedQuery}`,
      snippet: 'Clique no link para ver os resultados no Google'
    }];
  }

  // Busca de imagens
  async searchImages(query, limit = 5) {
    try {
      // Usando Unsplash API (gratuita)
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: query,
          per_page: limit,
          client_id: 'YOUR_UNSPLASH_ACCESS_KEY' // Obtenha em unsplash.com/developers
        }
      });

      if (response.data.results) {
        return response.data.results.map(img => ({
          url: img.urls.regular,
          thumbnail: img.urls.thumb,
          description: img.description || img.alt_description,
          author: img.user.name,
          link: img.links.html
        }));
      }

      return this.fallbackImageSearch(query);
    } catch (error) {
      Logger.error('Erro na busca de imagens:', error);
      return this.fallbackImageSearch(query);
    }
  }

  fallbackImageSearch(query) {
    const encodedQuery = encodeURIComponent(query);
    return [{
      url: null,
      link: `https://www.google.com/search?tbm=isch&q=${encodedQuery}`,
      description: `Busque "${query}" no Google Imagens`
    }];
  }

  // Busca de vídeos (YouTube)
  async searchVideos(query, limit = 5) {
    try {
      // Usando YouTube Data API v3
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          maxResults: limit,
          type: 'video',
          key: 'YOUR_YOUTUBE_API_KEY' // Obtenha em console.cloud.google.com
        }
      });

      if (response.data.items) {
        return response.data.items.map(video => ({
          title: video.snippet.title,
          videoId: video.id.videoId,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.medium.url,
          channel: video.snippet.channelTitle,
          description: video.snippet.description
        }));
      }

      return this.fallbackVideoSearch(query);
    } catch (error) {
      Logger.error('Erro na busca de vídeos:', error);
      return this.fallbackVideoSearch(query);
    }
  }

  fallbackVideoSearch(query) {
    const encodedQuery = encodeURIComponent(query);
    return [{
      title: `Resultados para: ${query}`,
      url: `https://www.youtube.com/results?search_query=${encodedQuery}`,
      description: 'Clique no link para ver os resultados no YouTube'
    }];
  }

  // Formatar resultados de busca
  formatGoogleResults(results) {
    let text = '🔍 *RESULTADOS DA BUSCA*\n\n';
    
    results.forEach((result, index) => {
      text += `*${index + 1}. ${result.title}*\n`;
      text += `📄 ${result.snippet}\n`;
      text += `🔗 ${result.link}\n\n`;
    });

    return text;
  }

  formatVideoResults(results) {
    let text = '🎥 *VÍDEOS ENCONTRADOS*\n\n';
    
    results.forEach((video, index) => {
      text += `*${index + 1}. ${video.title}*\n`;
      text += `📺 Canal: ${video.channel}\n`;
      text += `🔗 ${video.url}\n\n`;
    });

    return text;
  }
}

export default new SearchService();
