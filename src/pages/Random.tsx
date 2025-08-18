import { useState } from 'react';
import Header from '../components/common/Header';
import Movies from '../components/common/Movies';

const Random = () => {
	const [searchQuery, setSearchQuery] = useState('');
	return <><Header onSearchChange={setSearchQuery} /><Movies searchQuery={searchQuery} /></>; // Pass an empty string or any default value for the search query
	// Alternatively, you can return any other content or component her;
};

export default Random;
