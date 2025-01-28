
import { useState } from "react"
import { useSelector } from "react-redux";
import {v4 as uuid} from 'uuid';
import { selectSelectedObjects } from "../features/demande/demandeSelector";
import { useDispatch } from "react-redux";
import {addReservation} from "../features/demande/reservationsAsyncAction";

export const Formulaire = () => {
    const [membresG, setMembresG] = useState([
        {
            firstName: "Pierrick",
            lastName: "Breaud",
            groupeTd: "TD33",
        },
    ]);
    const objectSelected = useSelector(selectSelectedObjects);
    const TD = ["TD11", "TD12", "TD13", "TD21", "TD22", "TD23", "TD31", "TD32", "TD33"];
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const form = event.target; // Assurez-vous que c'est bien un formulaire HTML
        const formData = new FormData(form); // Crée un objet FormData avec le formulaire

        const values = {
            projectName: formData.get("projectName"),
            projectDescription: formData.get("projectDescription"),
            projectPlan: formData.get("projectPlan"),
        };
        const idStatus= uuid();
        const reservation = {
            _id: uuid(),
            userId: "testUser",
            reservationDate: "2024-11-28T09:00:00Z",
            returnDate: "2024-11-30T09:00:00Z",
            projectName: values.projectName,
            projectDescription: values.projectDescription,
            groupMembers: membresG,
            implementationPlan: values.projectPlan,
            items: objectSelected,
            idStatus: idStatus,
            professor: "perigmes@gmail.com",
        };
        const reservation_status= {
            idStatus: idStatus,
            status: "pending",
        }
         dispatch(addReservation({ reservation, reservation_status })).unwrap();
    };

    return (
        <div>
            <h1>Formulaire</h1>
            {/* Assurez-vous que `onSubmit` est relié au formulaire */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="projectName">Nom du projet</label>
                    <textarea id="projectName" name="projectName"></textarea>
                    <label htmlFor="projectDescription">Description du projet</label>
                    <textarea id="projectDescription" name="projectDescription"></textarea>
                    <label htmlFor="projectPlan">Votre plan d'implantation</label>
                    <input id="projectPlan" type="file" accept="image/*" name="projectPlan" />
                    <label htmlFor="projectJustification">Justification du matériel choisi</label>
                    <textarea id="projectJustification" name="projectJustification"></textarea>
                </fieldset>
                <fieldset>
                    <h2>Votre groupe</h2>
                    <div>
                        {membresG.map((membre, index) => (
                            <div key={index}>
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    value={membre.firstName}
                                    onBlur={(e) =>
                                        setMembresG((prev) => {
                                            const newMembres = [...prev];
                                            newMembres[index].firstName = e.target.value;
                                            return newMembres;
                                        })
                                    }
                                />
                                <label>Nom</label>
                                <input
                                    type="text"
                                    value={membre.lastName}
                                    onBlur={(e) =>
                                        setMembresG((prev) => {
                                            const newMembres = [...prev];
                                            newMembres[index].lastName = e.target.value;
                                            return newMembres;
                                        })
                                    }
                                />
                                <label>Groupe TD</label>
                                <select
                                    onChange={(e) =>
                                        setMembresG((prev) => {
                                            const newMembres = [...prev];
                                            newMembres[index].groupeTd = e.target.value;
                                            return newMembres;
                                        })
                                    }
                                >
                                    {TD.map((td, i) => (
                                        <option key={i} value={td}>
                                            {td}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newList = [...membresG];
                                newList.push({
                                    firstName: "",
                                    lastName: "",
                                    groupeTd: "",
                                });
                                setMembresG(newList);
                            }}
                            type="button"
                        >
                            Ajouter un membre
                        </button>
                    </div>
                    <input type="checkbox" />
                    <label>
                        En cochant cette case, je déclare prendre le matériel désigné en charge, en bon état. Je certifie également que ce
                        matériel ne sera pas utilisé pour un usage commercial. Enfin je m’engage à ramener et ranger le matériel dans les
                        délais fixés, et à signaler toute anomalie dans le fonctionnement du matériel.
                    </label>
                    <label>Signé "Lu et approuvé"</label>
                    <input type="text" />
                    <button type="submit">Envoyer</button>
                </fieldset>
            </form>
        </div>
    );
};
