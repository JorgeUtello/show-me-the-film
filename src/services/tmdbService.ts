// src/services/tmdbService.ts

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '4f4bcfa8c7be34d1702bd0de483aec84';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjRiY2ZhOGM3YmUzNGQxNzAyYmQwZGU0ODNhZWM4NCIsIm5iZiI6MTc1NTAzOTE0OC4xMjUsInN1YiI6IjY4OWJjNWFjNmM0NTQyNmRkMzVkMWU5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALQwom5JtL99zUjFEm08iVUt4V8UgiCIhrjKnMN6HgY';

export async function getPopularMovies(language = 'es-ES') {
  const url = `${API_BASE_URL}/movie/popular?language=${language}&api_key=${API_KEY}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener películas populares');
  }
  return response.json();
}

export async function searchMovie(search: string, language = 'es-ES') {
  const url = `${API_BASE_URL}/search/movie?query=${search}&=${language}&api_key=${API_KEY}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener resultados de búsqueda');
  }
  return response.json();
}