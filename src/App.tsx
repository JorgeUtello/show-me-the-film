import { useState } from 'react';
import './App.css'
import Header from './components/common/Header'
import TMDbApp from './TMDbApp'

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Header onSearchChange={setSearchQuery} />
      <TMDbApp searchQuery={searchQuery} />
    </>
  );
}

export default App
