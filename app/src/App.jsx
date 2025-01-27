import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ListObjects from './pages/ListObjects';
import MainHeader from './components/MainHeader';
import { Formulaire } from './pages/Formulaire';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './assets/styles/commun.scss';
import './assets/styles/card.scss';
import { loadMateriel, loadReservation } from './features/demande/reservationsAsyncAction';
import { Reservation } from './pages/Reservation';
import Demarches from './pages/Demarches';
import NavFormBtns from './components/objects/NavFormBtns';

const NavFormBtnsLayout = () => {
  return (
    <>
      <Outlet />
      <NavFormBtns />
    </>
  );
};

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMateriel());
    dispatch(loadReservation());
  }, [dispatch]);

  return (
    <main>
      <BrowserRouter>
      <MainHeader/>
        <Routes>
          <Route path="/" element={<Navigate to="/list-objects" replace />} />
          <Route element={<NavFormBtnsLayout />}>
            <Route path="/list-objects" element={<ListObjects />} />
            <Route path="/formulaire-reservation" element={<Formulaire />} />
          </Route>
          <Route path='/reservation-confirmation/:response/:id' element={<Reservation/>}/>
          <Route path='/mes-demarches' element={<Demarches/>}/>
        </Routes>
      </BrowserRouter>
    </main>
  );
}