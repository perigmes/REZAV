import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ListObjects from "./pages/ListObjects";
import MainHeader from "./components/MainHeader";
import { Formulaire } from "./pages/Formulaire";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./assets/styles/commun.scss";
import "./assets/styles/card.scss";

import {
  loadMateriel,
  loadReservation,
} from "./features/demande/reservationsAsyncAction";
import { Reservation } from "./pages/Reservation";
import Demarches from "./pages/Demarches";
import NavFormBtns from "./components/objects/NavFormBtns";
import Header from "./components/Header";
import TableauBord from "./pages/TableauBord";

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
    <BrowserRouter>
      <Header />
      <main>
        <MainHeader />
          <Routes>
            <Route path="/" element={<TableauBord />} />
            <Route element={<NavFormBtnsLayout />}>
              <Route path="/list-objects" element={<ListObjects />} />
              <Route path="/formulaire-reservation" element={<Formulaire />} />
            </Route>
            <Route
              path="/reservation-confirmation/:response/:id"
              element={<Reservation />}
            />
            <Route path="/mes-demarches" element={<Demarches />} />
            <Route path="/reservation-confirmation/test" element={<Reservation/>}/>
          </Routes>
      </main>
    </BrowserRouter>
  );
}
