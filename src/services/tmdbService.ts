// src/services/tmdbService.ts

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '4f4bcfa8c7be34d1702bd0de483aec84';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjRiY2ZhOGM3YmUzNGQxNzAyYmQwZGU0ODNhZWM4NCIsIm5iZiI6MTc1NTAzOTE0OC4xMjUsInN1YiI6IjY4OWJjNWFjNmM0NTQyNmRkMzVkMWU5MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ALQwom5JtL99zUjFEm08iVUt4V8UgiCIhrjKnMN6HgY';

// Interfaz para los parámetros de películas aleatorias
interface RandomMovieParams {
  count?: number;
  minRating?: number;
  maxRating?: number;
  searchTerm?: string;
  language?: string;
}

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
  // CORREGIDO: Faltaba "language" en el parámetro
  const url = `${API_BASE_URL}/search/movie?query=${search}&language=${language}&api_key=${API_KEY}`;
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

export async function getRandomMovie() {
  const res = await fetch(`${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No se encontraron películas.");
  }

  // elegir una película random de la lista popular
  const randomIndex = Math.floor(Math.random() * data.results.length);
  return data.results[randomIndex];
}

// Función para obtener películas aleatorias con filtros
export async function getRandomMovies({
  count = 1,
  minRating = 0,
  maxRating = 10,
  searchTerm,
  language = 'es-ES'
}: RandomMovieParams = {}) {
  try {
    let allMovies: any[] = [];

    if (searchTerm) {
      // Buscar por término específico
      allMovies = await searchMoviesByTerm(searchTerm, minRating, maxRating, language);
    } else {
      // Buscar películas de diferentes fuentes para mayor variedad
      allMovies = await getMoviesFromMultipleSources(minRating, maxRating, language);
    }

    if (allMovies.length === 0) {
      throw new Error('No se encontraron películas que coincidan con los criterios');
    }

    // Eliminar duplicados basándose en el ID
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    );

    // Seleccionar películas aleatorias
    const randomMovies = selectRandomMovies(uniqueMovies, count);
    
    return {
      results: randomMovies,
      total_results: randomMovies.length,
      total_pages: 1,
      page: 1
    };

  } catch (error) {
    console.error('Error al obtener películas aleatorias:', error);
    throw error;
  }
}

// Función auxiliar para buscar películas por término
async function searchMoviesByTerm(
  searchTerm: string, 
  minRating: number, 
  maxRating: number, 
  language: string
) {
  const movies: any[] = [];
  
  // Buscar en las primeras 5 páginas para tener variedad
  for (let page = 1; page <= 5; page++) {
    const url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&language=${language}&page=${page}&api_key=${API_KEY}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!response.ok) continue;

    const data = await response.json();
    
    const filteredMovies = data.results.filter((movie: any) => 
      movie.vote_average >= minRating && 
      movie.vote_average <= maxRating &&
      movie.poster_path &&
      movie.overview
      // CORREGIDO: Removí movie.release_date porque puede ser null y filtrar películas válidas
    );

    movies.push(...filteredMovies);

    // Si no hay más páginas, salir del bucle
    if (page >= data.total_pages) break;
  }

  return movies;
}

// Función auxiliar para obtener películas de múltiples fuentes
async function getMoviesFromMultipleSources(
  minRating: number, 
  maxRating: number, 
  language: string
) {
  const movies: any[] = [];
  
  // Diferentes endpoints para obtener variedad
  const endpoints = [
    '/movie/popular',
    '/movie/top_rated',
    '/movie/now_playing',
    '/movie/upcoming',
    '/discover/movie?sort_by=popularity.desc',
    '/discover/movie?sort_by=vote_average.desc',
    '/discover/movie?sort_by=release_date.desc'
  ];

  for (const endpoint of endpoints) {
    // CORREGIDO: Reducí el número de páginas aleatorias para evitar demasiadas requests
    const randomPages = [1, 2, 3];
    
    for (const page of randomPages) {
      const separator = endpoint.includes('?') ? '&' : '?';
      const url = `${API_BASE_URL}${endpoint}${separator}language=${language}&page=${page}&api_key=${API_KEY}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json;charset=utf-8',
          },
        });

        if (!response.ok) continue;

        const data = await response.json();
        
        const filteredMovies = data.results.filter((movie: any) => 
          movie.vote_average >= minRating && 
          movie.vote_average <= maxRating &&
          movie.poster_path &&
          movie.overview
          // CORREGIDO: Removí movie.release_date del filtro
        );

        movies.push(...filteredMovies);

        // CORREGIDO: Agregué break para evitar demasiadas requests
        if (movies.length > 500) break;

      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        continue;
      }
    }
    
    // CORREGIDO: Break si ya tenemos suficientes películas
    if (movies.length > 500) break;
  }

  return movies;
}

// Función auxiliar para seleccionar películas aleatorias
function selectRandomMovies(movies: any[], count: number) {
  if (movies.length <= count) {
    return movies;
  }

  const selected: any[] = [];
  const moviesCopy = [...movies];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * moviesCopy.length);
    selected.push(moviesCopy[randomIndex]);
    moviesCopy.splice(randomIndex, 1);
  }

  return selected;
}