
import { useState } from "react"
import { useSelector } from "react-redux";
import {v4 as uuid} from 'uuid';
import { selectSelectedObjects } from "../features/demande/demandeSelector";
import { useDispatch } from "react-redux";
export const Formulaire = () => {
    const [membresG, setMembresG] = useState([
        {
            firstName: "Pierrick",
            lastName: 'Breaud',
            groupeTd: 'TD33'
        }
    ])
    const objectSelected= useSelector(selectSelectedObjects);
    const TD = ['TD11', 'TD12', 'TD13', 'TD21', 'TD22', 'TD23', 'TD31', 'TD32', 'TD33'];
    const dispatch= useDispatch();
    const handleSubmit =(values)=>{
        const reservation = {
            _id:  uuid(),
            userId: 'testUser',
            reservationDate: "2024-11-28T09:00:00Z", 
            returnDate: "2024-11-30T09:00:00Z", 
            projectName:values.projectName,
            projectDescription:values.projectDescription,
            groupMembers:membresG,
            implementationPlan:values.projectPlan,
            items:objectSelected,
            idStatus:  uuid(),
            professor: "perigmes@gmail.com"
        }
        dispatch(addReservation(reservation))
    }
    return (
        <div>
            <h1>Formulaire</h1>
            <form>
                <fieldset>
                    <label htmlFor="projectName">Nom du projet</label>
                    <textarea id="projectName" name="projectName"></textarea>
                    <label htmlFor="projectDescription">Description du projet</label>
                    <textarea id="projectDescription" name="projectDescription"></textarea>
                    <label htmlFor="projectPlan">Votre plan d'implantation</label>
                    <input id="projectPlan" type="file" accept="image/*" />
                    <label htmlFor="projectJustification">Justification du materiel choisi</label>
                    <textarea id="projectJustification" name="projectJustification"></textarea>
                </fieldset>
                <fieldset>
                    <h2>Votre groupe</h2>
                    <div>
                        {membresG.map((membre, index) => (
                            <div key={index}>
                                <label>Prénom</label>
                                <input type="text" value={membre.firstName}  onBlur={(e)=>setMembresG((prev)=>{
                                    const newMembres = [...prev]
                                    newMembres[index].firstName = e.target.value
                                    return newMembres
                                })}/>
                                <label>Nom</label>
                                <input type="text" value={membre.lastName}  onBlur={(e)=>{setMembresG((prev)=>{
                                    const newMembres = [...prev]
                                    newMembres[index].lastName = e.target.value
                                    return newMembres
                                })}}/>
                                <label>Groupe TD</label>
                                <select >
                                    {TD.map((td, index) => (
                                        <option key={index} value={td} onBlur={()=>setMembresG((prev)=>{
                                            const newMembres = [...prev]
                                            newMembres[index].groupeTd = td
                                            return newMembres
                                        })}>{td}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button onClick={(e) => {
                            const newList = [...membresG]
                            newList.push({
                                firstName: "",
                                lastName: "",
                                groupeTd: ""
                            })
                            setMembresG(newList)
                        }
                        } type="button">Ajouter un membre</button>
                    </div>
                    <input type="checkbox" />
                    <label>En cochant cette case, je déclare prendre le matériel désigné en charge, en bon état. Je certifie également que ce matériel ne sera pas utilisé pour un
                        usage commercial. Enfin je m’engage à ramener et ranger le matériel dans les délais fixés, et à signaler toute
                        anomalie dans le fonctionnement du matériel.</label>
                        <label>Signé "Lu et approuvé"</label>
                        <input type="text" />
                        <button type="submit" onClick={handleSubmit}>Envoyer</button>

                </fieldset>

            </form>
        </div>
    )
}