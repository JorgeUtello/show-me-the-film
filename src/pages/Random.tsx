import { useEffect, useState } from 'react';
import { getPopularMovies, getRandomMovies } from '../services/tmdbService';
import '../aa.css'


interface Movie {
	id: number;
	title: string;
	poster_path: string | null;
	release_date: string;
	original_language: string;
	vote_average: number;
	vote_count: number;
	overview: string;
}

interface SearchParams {
	count: number;
	minRating: number;
	maxRating: number;
	searchTerm: string;
}

const Random = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

	// Estados para el buscador avanzado
	const [searchParams, setSearchParams] = useState<SearchParams>({
		count: 5,
		minRating: 6,
		maxRating: 10,
		searchTerm: ''
	});

	const pickRandomMovie = (list: Movie[]) => {
		if (list.length === 0) return;
		const randomIndex = Math.floor(Math.random() * list.length);
		setDisplayedMovies([list[randomIndex]]);
	};

	const pickMultipleRandomMovies = (list: Movie[], count: number) => {
		if (list.length === 0) return;
		const shuffled = [...list].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, Math.min(count, list.length));
		setDisplayedMovies(selected);
	};

	// Búsqueda avanzada con la nueva función
	const handleAdvancedSearch = async () => {
		setSearching(true);
		setError(null);

		try {
			const data = await getRandomMovies({
				count: searchParams.count,
				minRating: searchParams.minRating,
				maxRating: searchParams.maxRating,
				searchTerm: searchParams.searchTerm.trim() || undefined
			});

			if (data.results.length === 0) {
				setError('No se encontraron películas con esos criterios.');
				setDisplayedMovies([]);
				return;
			}

			setDisplayedMovies(data.results);
		} catch (err) {
			setError('Error al buscar películas. Intenta nuevamente.');
			setDisplayedMovies([]);
		} finally {
			setSearching(false);
		}
	};

	// Búsqueda rápida solo por término
	const handleQuickSearch = async (searchTerm: string) => {
		if (!searchTerm.trim()) {
			// Si no hay término, volver a películas populares
			pickMultipleRandomMovies(movies, 5);
			return;
		}

		setSearching(true);
		setError(null);

		try {
			const data = await getRandomMovies({
				count: 5,
				minRating: 6,
				maxRating: 10,
				searchTerm: searchTerm.trim()
			});

			if (data.results.length === 0) {
				setError(`No se encontraron películas con "${searchTerm}".`);
				setDisplayedMovies([]);
				return;
			}

			setDisplayedMovies(data.results);
		} catch (err) {
			setError('Error al buscar películas. Intenta nuevamente.');
			setDisplayedMovies([]);
		} finally {
			setSearching(false);
		}
	};

	useEffect(() => {
		async function fetchMovies() {
			try {
				const data = await getPopularMovies();
				const results: Movie[] = data?.results || [];

				if (results.length === 0) {
					setError('No se encontraron películas.');
					return;
				}

				setMovies(results);
				pickRandomMovie(results); // Primera selección
			} catch (err) {
				setError('Hubo un problema al cargar la película.');
			} finally {
				setLoading(false);
			}
		}

		fetchMovies();
	}, []);

	if (loading) return <p>Cargando recomendación...</p>;
	if (error && movies.length === 0) return <p>{error}</p>;

	return (
		<div className="tmdb-container random-page">
			<div className="random-header-row">
				{/* Controles principales */}
				<div className="random-controls">
					<button
						className="random-btn"
						onClick={() => pickRandomMovie(movies)}
						disabled={searching}
					>
						Dame otra peli 🎲
					</button>

					<button
						className="random-btn random-btn-multiple"
						onClick={() => pickMultipleRandomMovies(movies, 5)}
						disabled={searching}
					>
						5 películas random 🎯
					</button>

					<button
						className={`random-btn random-btn-advanced ${showAdvancedSearch ? 'active' : ''}`}
						onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
					>
						Búsqueda Avanzada ⚙️
					</button>
				</div>
				{/* Búsqueda Avanzada */}
			{showAdvancedSearch && (
				<div className="random-advanced-search">
					<h3>🔍 Búsqueda Avanzada</h3>

					<div className="random-search-grid">
						<div className="random-search-field">
							<label>🎬 Cantidad de películas:</label>
							<select
								className='random-input'
								value={searchParams.count}
								onChange={(e) => setSearchParams({ ...searchParams, count: Number(e.target.value) })}
							>
								<option value={1}>1 película</option>
								<option value={3}>3 películas</option>
								<option value={5}>5 películas</option>
								<option value={10}>10 películas</option>
								<option value={20}>20 películas</option>
							</select>
						</div>

						<div className="random-search-field">
							<label>⭐ Calificación mínima:</label>
							<input
								type="number"
								className='random-input'
								min="0"
								max="10"
								step="0.1"
								value={searchParams.minRating}
								onChange={(e) => setSearchParams({ ...searchParams, minRating: Number(e.target.value) })}
							/>
						</div>

						<div className="random-search-field">
							<label>⭐ Calificación máxima:</label>
							<input
								type="number"
								className='random-input'
								min="0"
								max="10"
								step="0.1"
								value={searchParams.maxRating}
								onChange={(e) => setSearchParams({ ...searchParams, maxRating: Number(e.target.value) })}
							/>
						</div>

						<div className="random-search-field">
							<label>🔤 Buscar por término:</label>
							<input
								type="text"
								className='random-input'
								placeholder='Ej: "lord", "star", "love"...'
								value={searchParams.searchTerm}
								onChange={(e) => setSearchParams({ ...searchParams, searchTerm: e.target.value })}
							/>
						</div>
					</div>

					<button
						className={`random-btn random-btn-search ${searchParams.minRating > searchParams.maxRating ? 'disabled' : ''}`}
						onClick={handleAdvancedSearch}
						disabled={searching || searchParams.minRating > searchParams.maxRating}
					>
						{searching ? '⏳ Buscando...' : '🚀 Buscar Películas'}
					</button>

					{searchParams.minRating > searchParams.maxRating && (
						<p className="random-error-text">
							⚠️ La calificación mínima no puede ser mayor que la máxima
						</p>
					)}
				</div>
			)}
			</div>

			

			{/* Estado de carga */}
			{searching && (
				<div className="random-loading">
					⏳ Buscando películas increíbles para ti...
				</div>
			)}

			{/* Mensaje de error */}
			{error && !searching && (
				<div className="random-error">
					⚠️ {error}
				</div>
			)}

			{/* Lista de películas */}
			<div className="random-movie-list">
				{displayedMovies.length === 0 && !searching && !error ? (
					<p>No se encontraron películas.</p>
				) : (
					<div className="tmdb-movie-list">
						{displayedMovies.map((movie) => (
							<div key={movie.id} className="tmdb-movie-card">
								<h2 className="tmdb-movie-title">{movie.title}</h2>
								{movie.poster_path ? (
									<img
										src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
										alt={movie.title}
										className="tmdb-movie-img"
									/>
								) : (
									<div className="tmdb-movie-img random-no-img">
										Sin imagen
									</div>
								)}
								<div className="tmdb-movie-details">
									<p className="tmdb-movie-info">
										<strong>Estreno:</strong> {movie.release_date}
									</p>
									<p className="tmdb-movie-info">
										<strong>Idioma:</strong> {movie.original_language}
									</p>
									<p className="tmdb-movie-info">
										<strong>Puntaje:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votos)
									</p>
									<p className="tmdb-movie-overview">{movie.overview}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Random;