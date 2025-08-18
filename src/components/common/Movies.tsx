import { useEffect, useState } from 'react';
// Update the import path below to the correct file, e.g. './api' or './movieService'
import { getPopularMovies, searchMovie } from '../../services/tmdbService';

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

interface MoviesProps {
	searchQuery: string; // 🔹 texto que viene de App/Header
}

const Movies = ({ searchQuery }: MoviesProps) => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);

		const fetchData = async () => {
			try {
				let data;

				if (searchQuery.trim()) {
					// 🔹 Buscar por título si hay texto
					data = await searchMovie(searchQuery);
				} else {
					// 🔹 Mostrar populares si no hay texto
					data = await getPopularMovies();
				}

				setMovies(data?.results || []);
			} catch (err) {
				console.error('Error al obtener películas:', err);
				setError('Hubo un problema al cargar las películas.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [searchQuery]); // 🔹 se ejecuta cuando cambia el texto

	if (loading) return <p>Cargando películas...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="tmdb-container">
			{movies.length === 0 ? (
				<p>No se encontraron películas.</p>
			) : (
				<div className="tmdb-movie-list">
					{movies.map((movie) => (
						<div key={movie.id} className="tmdb-movie-card">
							<h2 className="tmdb-movie-title">{movie.title}</h2>
										{movie.poster_path ? (
											<img
												src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
												alt={movie.title}
												className="tmdb-movie-img"
											/>
										) : (
											<div
												className="tmdb-movie-img"
												style={{
													background: '#ccc',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#888',
													fontSize: 14,
													fontStyle: 'italic',
												}}
											>
												Sin imagen
											</div>
										)}
							<div className="tmdb-movie-details">
								<p className="tmdb-movie-info"><strong>Estreno:</strong> {movie.release_date}</p>
								<p className="tmdb-movie-info"><strong>Idioma:</strong> {movie.original_language}</p>
								<p className="tmdb-movie-info"><strong>Puntaje:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votos)</p>
								<p className="tmdb-movie-overview">{movie.overview}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Movies;
