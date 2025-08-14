import { useEffect, useState } from 'react';
import { getPopularMovies } from './services/tmdbService';
import './aa.css';

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

const TMDbApp = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getPopularMovies()
			.then(data => {
				setMovies(data?.results || []); // Asegurar que siempre sea un array
			})
			.catch(err => {
				console.error('Error al obtener películas populares:', err);
				setError('Hubo un problema al cargar las películas.');
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Cargando películas...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className="tmdb-container">
			<h1 className="tmdb-title">Películas</h1>
			{movies.length === 0 ? (
				<p>No se encontraron películas.</p>
			) : (
				<div className="tmdb-movie-list">
					{movies.map((movie) => (
						<div key={movie.id} className="tmdb-movie-card">
							<h2 className="tmdb-movie-title">{movie.title}</h2>
							{movie.poster_path && (
								<img
									src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
									alt={movie.title}
									className="tmdb-movie-img"
								/>
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

export default TMDbApp;
