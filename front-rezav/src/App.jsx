import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import materielData from './assets/bdd/matériel.materiel.json';
import { setObjects } from './features/demande/demandeSlice';
import ListObjects from './pages/ListObjects';
import MainHeader from './components/MainHeader';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/styles/commun.scss';
import './assets/styles/card.scss';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setObjects(materielData));
  }, [dispatch]);
  
  
  return (
    <main>
      <BrowserRouter>
      <MainHeader/>
        <Routes>
          <Route path="/" element={<ListObjects />} />
          <Route path="/list-objects" element={<ListObjects />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;