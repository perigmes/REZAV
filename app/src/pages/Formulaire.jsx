import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDataDemande,
  selectObjects,
  selectUserInfos,
} from "../features/demande/demandeSelector";
import { useNavigate } from "react-router-dom";
import { addReservation } from "../features/demande/reservationsAsyncAction";
import { v4 as uuid } from "uuid";
import {
  setFormValidation,
  updateDataDemande,
  clearDataDemande,
} from "../features/demande/demandeSlice";
import { formatDateToDateHourMinute } from "../utils/tools";
import "../assets/styles/formulaire.scss";
import MembreManager from "../components/formulaire/MembreManager";
import { Button } from "@mui/base";

export const Formulaire = () => {
  const objects = useSelector(selectObjects);
  const dataDemande = useSelector(selectDataDemande);
  const dispatch = useDispatch();
  const group = useSelector(selectDataDemande).group;
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(1);
  const filteredObjects = objects.filter((obj) =>
    dataDemande.objects.includes(obj._id)
  );
  const [fileName, setFileName] = useState("Déposez votre plan ici"); // État pour le nom du fichier
  const [checkboxResp, setCheckboxResp] = useState(false);
  const [luApprouve, setLuApprouve] = useState("");
  const [reservation, setReservation] = useState(dataDemande);
  const user = useSelector(selectUserInfos);
  

  const TD = [
    { id: 0, grp: "-" },
    { id: 1, grp: "TD11" },
    { id: 2, grp: "TD12" },
    { id: 3, grp: "TD13" },
    { id: 4, grp: "TD21" },
    { id: 5, grp: "TD22" },
    { id: 6, grp: "TD23" },
    { id: 7, grp: "TD31" },
    { id: 8, grp: "TD32" },
    { id: 9, grp: "TD33" },
  ];

  const [membresG, setMembresG] = useState(group);
  useEffect(() => {
    if (
      dataDemande.startDT === "" ||
      dataDemande.returnDT === "" ||
      dataDemande.objects.length === 0
    ) {
      navigate("/list-objects");
    }
  }, []);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Déposez votre plan ici");
    }
    setReservation({ ...reservation, implementationPlan: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStep === 1) {
      if (!dataDemande.name || !dataDemande.desc || !dataDemande.justif) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      setFormStep(2);
    } else {
      const formData = new FormData();

      // Ajout des données primitives
      formData.append("projectName", reservation.name);
      formData.append("projectDescription", reservation.desc);
      formData.append("projectJustification", reservation.justif);
      formData.append("reservationDate", reservation.startDT);
      formData.append("returnDate", reservation.returnDT);

      // Ajout des objets JSON sous forme de string
      formData.append("groupMembers", JSON.stringify(membresG));
      formData.append("items", JSON.stringify(reservation.objects));

      // Ajout du fichier PDF
      if (reservation.implementationPlan instanceof File) {
        formData.append("implementationPlan", reservation.implementationPlan);
      } else {
        console.error("⚠️ Aucun fichier PDF valide détecté.");
      }

      // Génération d'un ID unique pour le statut
      const idStatus = uuid();
      formData.append("idStatus", idStatus);

      const reservation_status = {
        idStatus: idStatus,
        status: "pending",
      };
      formData.append("reservation_status", JSON.stringify(reservation_status));

      // Envoi via Redux
      await dispatch(addReservation({ reservation: formData })).unwrap();
      navigate("/mes-demarches");
      dispatch(clearDataDemande());
    }
  };

  const handleMembersChange = (updatedMembers) => {
    setMembresG(updatedMembers);
    dispatch(updateDataDemande({ id: "members", value: updatedMembers }));
  };

  const validateForm = () => {
    const allMembersValid = membresG.every(
      (membre) =>
        membre.firstName.trim() !== "" &&
        membre.lastName.trim() !== "" &&
        membre.groupeTd !== "-"
    );

    const checkboxRespValid = checkboxResp;
    const luApprouveValid =
      luApprouve.trim().toLowerCase() === "lu et approuvé";

    const isValid = allMembersValid && checkboxRespValid && luApprouveValid;

    dispatch(setFormValidation(isValid));
    if (allMembersValid) {
      dispatch(updateDataDemande({ id: "group", value: membresG }));
    }
  };

  useEffect(() => {
    validateForm();
  }, [membresG, checkboxResp, luApprouve]);

  const handleChangeInput = (newValue, id) => {
    setReservation({ ...reservation, [id]: newValue });
    dispatch(updateDataDemande({ id, value: newValue }));
  };

  return (
    <div className="main-content formulaire">
      <div className="res-list-obj">
        <header>
          <h3 className="titre-3">Mes articles sélectionnés</h3>
          <span>
            Du {formatDateToDateHourMinute(dataDemande.startDT)} au{" "}
            {formatDateToDateHourMinute(dataDemande.returnDT)}
          </span>
        </header>
        <div>
          {filteredObjects.map((object) => (
            <div className="object-list-item" key={object._id}>
              <span className="title">{object.name}</span>
              <span className="status">Disponible</span>
              <span className="material-symbols-rounded icon">check</span>
              <div className="color-status"></div>
            </div>
          ))}
        </div>
      </div>

      <form className={`res-form form-step-${formStep}`}>
        <header>
          <h3 className="titre-3">Formulaire de demande</h3>
        </header>

        <fieldset className="step-field-1">
          <h4>Votre Projet</h4>
          <div className="rezav-input input-txt">
            <label htmlFor="name">Nom du projet</label>
            <input
              type="text"
              placeholder="Écrivez ici"
              id="name"
              name="name"
              value={dataDemande.name || ""}
              required
              onChange={(e) => handleChangeInput(e.target.value, "name")}
            />
          </div>
          <div className="rezav-input input-txt">
            <label htmlFor="desc">Description du projet</label>
            <textarea
              id="desc"
              placeholder="Écrivez ici"
              name="desc"
              value={dataDemande.desc || ""}
              required
              onChange={(e) => handleChangeInput(e.target.value, "desc")}
            ></textarea>
          </div>
          <h4>Votre plan d'implantation</h4>
          <div className="rezav-input input-file">
            <input
              id="plan"
              accept=".pdf, image/png, image/jpeg, image/webp"
              type="file"
              name="plan"
              required
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
            <label htmlFor="plan" className="material-symbols-rounded">
              upload_file
            </label>
            <p className="label">{fileName}</p>
            <p className="restrictions">fichier pdf ou img uniquement</p>
          </div>
          <h4>Justification du matériel choisi</h4>
          <div className="rezav-input input-txt">
            <textarea
              placeholder="Écrivez ici"
              id="justif"
              name="justif"
              value={dataDemande.justif || ""}
              required
              onChange={(e) => handleChangeInput(e.target.value, "justif")}
            ></textarea>
          </div>
        </fieldset>

        <fieldset className="step-field-2">
          <h4>Votre groupe</h4>
          <MembreManager
            TD={TD}
            initialMembers={membresG}
            onMembersChange={handleMembersChange}
          />
          <div className="div-responsabilite">
            <input
              id="checkboxResp"
              className="rezav-checkbox"
              type="checkbox"
              checked={checkboxResp}
              required
              onChange={(e) => setCheckboxResp(e.target.checked)}
            />
            <label
              className="rezav-checkbox-label"
              htmlFor="checkboxResp"
            ></label>
            <p>
              En cochant cette case, je déclare prendre le matériel désigné en
              charge, en bon état. Je certifie également que ce matériel ne sera
              pas utilisé pour un usage commercial. Enfin je m’engage à ramener
              et ranger le matériel dans les délais fixés, et à signaler toute
              anomalie dans le fonctionnement du matériel.
            </p>
          </div>
          <div className="rezav-input input-txt">
            <label htmlFor="luApprouve">Signer "Lu et approuvé"</label>
            <input
              type="text"
              placeholder="Écrivez ici"
              id="luApprouve"
              name="luApprouve"
              required
              value={luApprouve}
              onChange={(e) => setLuApprouve(e.target.value)}
            />
          </div>
        </fieldset>
        <div className="nav-form-btns">
          <Button
            className="rezav-button-1 prev-step"
            onClick={() => {
              if (formStep === 2) {
                setFormStep(1);
              } else {
                navigate("/list-objects");
              }
            }}
          >
            Précédent
          </Button>
          <Button className="rezav-button-1" onClick={handleSubmit}>
            {formStep === 2 ? "Valider" : "Suivant"}
          </Button>
        </div>
      </form>
    </div>
  );
};
