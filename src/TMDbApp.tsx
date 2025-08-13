import { useEffect, useState } from 'react';
import { getPopularMovies } from './services/tmdbService';

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
		<div style={{ padding: "20px" }}>
			<h1>Películas</h1>
			{movies.length === 0 ? (
				<p>No se encontraron películas.</p>
			) : (
				movies.map((movie) => (
					<div
						key={movie.id}
						style={{
							marginBottom: "20px",
							padding: "10px",
							border: "1px solid #ccc",
							borderRadius: "8px",
						}}
					>
						<h2>{movie.title}</h2>
						{movie.poster_path && (
							<img
								src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
								alt={movie.title}
								style={{ borderRadius: "5px" }}
							/>
						)}
						<p><strong>Fecha de estreno:</strong> {movie.release_date}</p>
						<p><strong>Idioma:</strong> {movie.original_language}</p>
						<p><strong>Puntaje:</strong> ⭐ {movie.vote_average} ({movie.vote_count} votos)</p>
						<p>{movie.overview}</p>
					</div>
				))
			)}
		</div>
	);
};

export default TMDbApp;
