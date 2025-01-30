import React, { useEffect, useState } from "react";
import Membre from "./Membre";

const MembreManager = ({ TD, initialMembers, onMembersChange }) => {
  const [membresG, setMembresG] = useState(initialMembers || []);

  const addMembre = () => {
    setMembresG((prevMembres) => [
      ...prevMembres,
      { firstName: "", lastName: "", groupeTd: "-" },
    ]);
  };

  const removeMembre = (index) => {
    setMembresG((prevMembres) => {
      const updatedMembres = prevMembres.filter((_, i) => i !== index);
      onMembersChange(updatedMembres);
      return updatedMembres;
    });
  };

  const handleChange = (value, index, field) => {
    setMembresG((prevMembres) => {
      const updatedMembres = prevMembres.map((membre, i) =>
        i === index ? { ...membre, [field]: value } : membre
      );
      onMembersChange(updatedMembres);
      return updatedMembres;
    });
  };
  

  return (
    <div className="groupe">
      {membresG.map((membre, index) => (
        <Membre
          key={index}
          membre={membre}
          index={index}
          handleChange={handleChange}
          removeMembre={removeMembre}
          TD={TD}
        />
      ))}
      <button
        role="button"
        onClick={(e) => {
          e.preventDefault();
          addMembre();
        }}
      >
        Ajouter un membre
        <span className="material-symbols-rounded">add_circle</span>
      </button>
    </div>
  );
};

export default MembreManager;
