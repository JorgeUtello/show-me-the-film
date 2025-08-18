import { Link } from 'react-router-dom';

const Menu = () => {
		return (
			<nav style={{ padding: '12px 0', background: '#222' }}>
				<ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 20, justifyContent: 'left' }}>
					<li>
						<Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
					</li>
					<li>
						<Link to="/random" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Recomendar</Link>
					</li>
				</ul>
			</nav>
		);
};

export default Menu;
