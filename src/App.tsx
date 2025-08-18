import { useState } from 'react';
import './App.css'
import Header from './components/common/Header'
import Menu from './components/common/Menu';
import TMDbApp from './TMDbApp'
import Random from './pages/Random';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={
          <>
            <Header onSearchChange={setSearchQuery} />
            <TMDbApp searchQuery={searchQuery} />
          </>
        } />
        <Route path="/random" element={<Random />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
