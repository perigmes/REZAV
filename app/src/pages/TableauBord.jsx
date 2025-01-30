import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/tableau-bord.scss";
import {
  selectLast3Demandes,
  selectLast5ValidReservations,
  selectObjects,
  selectUSerInfos,
} from "../features/demande/demandeSelector";
import {
  getLast3Demandes,
  getLast5ValidReservations,
} from "../features/demande/reservationsAsyncAction";
import { useEffect, useRef } from "react";
import { formatDateToDayMonthYear, isDateInPast } from "../utils/tools";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

const TableauBord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUSerInfos);

  useEffect(() => {
    dispatch(getLast5ValidReservations(user.idUser));
    dispatch(getLast3Demandes(user.idUser));
  }, [dispatch, user.idUser]);

  const last5ValidReservations = useSelector(selectLast5ValidReservations);
  const last3Demandes = useSelector(selectLast3Demandes);
  const allObjects = useSelector(selectObjects);
  console.log(last3Demandes);

  const uniqueObjects = allObjects.reduce((acc, obj) => {
    if (!acc.some((item) => item.name === obj.name)) {
      acc.push(obj);
    }
    return acc;
  }, []);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="main-content dashboard">
      <div className="tableau-bord">
        <h3 className="titre-3">
          Bienvenue {user.firstName + " " + user.lastName}
        </h3>
        <div className="sections">
          <section className="tab-section reservations shared-styles">
            <header>
              <img src="/images/icon-reservations.svg" alt="" />
              <h4 className="titre-4">Historique de vos réservations</h4>
              <p>Retrouvez ici vos réservations les plus récentes</p>
            </header>
            <div className="list-reservations">
              {last5ValidReservations.map((reservation, index) => (
                <div
                  key={reservation._id}
                  className={
                    "reservation-item" +
                    (isDateInPast(reservation.returnDate)
                      ? " finished"
                      : " accepted")
                  }
                >
                  <div className="color"></div>
                  <div className="infos">
                    <p className="name" title={reservation.projectName}>
                      {reservation.projectName}
                    </p>
                    <p className="date">
                      {formatDateToDayMonthYear(reservation.reservationDate)} -{" "}
                      {formatDateToDayMonthYear(reservation.returnDate)}
                    </p>
                    <p className="status">
                      {isDateInPast(reservation.returnDate)
                        ? "Terminée"
                        : "Validée"}
                    </p>
                  </div>
                  <span className="material-symbols-rounded">
                    arrow_forward_ios
                  </span>
                </div>
              ))}
            </div>
            <button className="tab-sec-btn" onClick={() => navigate("/mes-demarches")}>Consulter mes réservations</button>
          </section>
          <div className="double-section">
            <section className="tab-section materiel">
              <div className="swiper-container">
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  centeredSlides={true}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay, Pagination, Navigation]}
                  className="objects-swiper"
                >
                  {uniqueObjects.map((object) => (
                    <SwiperSlide key={object._id}>
                      <img 
                        src={object.picture || "/images/error-img.webp"} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "/images/error-img.webp"; 
                        }}
                        alt={object.name} 
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <span
                  ref={prevRef}
                  className="material-symbols-rounded custom-swiper-prev"
                >
                  arrow_back_ios
                </span>
                <span
                  ref={nextRef}
                  className="material-symbols-rounded custom-swiper-next"
                >
                  arrow_forward_ios
                </span>
              </div>

              <h4 className="titre-4">Voir le matériel</h4>
              <p>Voir le matériel et accéder à la réservation</p>
              <button className="tab-sec-btn" onClick={() => navigate("/list-objects")}>
                Accéder à la liste du matériel
              </button>
            </section>
            <section className="tab-section demandes shared-styles">
              <header>
                <img src="/images/icon-demandes.svg" alt="" />
                <h4 className="titre-4">Vos demandes</h4>
                <p>Voici vos 3 dernières demandes</p>
              </header>
              <div className="list-demandes">
                {last3Demandes.map((reservation, index) => (
                  <div
                    key={reservation._id}
                    className={"reservation-item " + reservation.status}
                  >
                    <div className="color"></div>
                    <div className="infos">
                      <p className="name" title={reservation.projectName}>
                        {reservation.projectName}
                      </p>
                      <p className="date">
                        {formatDateToDayMonthYear(reservation.reservationDate)}{" "}
                        - {formatDateToDayMonthYear(reservation.returnDate)}
                      </p>
                      <p className="status">
                        {reservation.status === "pending"
                          ? "En attente"
                          : reservation.status === "rejected"
                          ? "Rejetée"
                          : ""}
                      </p>
                    </div>
                    <span className="material-symbols-rounded">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
              </div>
              <button className="tab-sec-btn" onClick={() => navigate("/mes-demarches")}>Accéder à mes demandes</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauBord;