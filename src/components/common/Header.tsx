import type { ChangeEvent } from 'react';

interface HeaderProps {
	onSearchChange: (value: string) => void; // función que recibimos de App
}

const Header = ({ onSearchChange }: HeaderProps) => {
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		onSearchChange(e.target.value); // enviamos el dato al padre
	};

	return (
		<div>
			<div>
				<input
					type="text"
					placeholder="Buscar películas..."
					className="tmdb-search-input"
					style={{
						width: '100%',
						maxWidth: 400,
						marginBottom: 24,
						padding: 8,
						fontSize: 16,
						borderRadius: 4,
						border: '1px solid #ccc',
						outline: 'none',
					}}
					onChange={handleInputChange}
				/>
			</div>
			<div className="tmdb-title">Películas</div>
		</div>
	);
};

export default Header;
