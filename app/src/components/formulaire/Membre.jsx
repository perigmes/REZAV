import React from "react";

const Membre = ({ membre, index, handleChange, removeMembre, TD }) => {
  return (
    <div className="membre" key={index}>
      <div className="rezav-input input-txt">
        <label htmlFor={`prenom-${index}`}>Prénom</label>
        <input
          type="text"
          placeholder="Écrivez ici"
          id={`prenom-${index}`}
          name={`prenom-${index}`}
          value={membre.firstName}
          onChange={(e) => handleChange(e.target.value, index, "firstName")}
        />
      </div>
      <div className="rezav-input input-txt">
        <label htmlFor={`nom-${index}`}>Nom</label>
        <input
          type="text"
          placeholder="Écrivez ici"
          id={`nom-${index}`}
          name={`nom-${index}`}
          value={membre.lastName}
          onChange={(e) => handleChange(e.target.value, index, "lastName")}
        />
      </div>
      <div className="rezav-input input-select">
        <label htmlFor={`groupe-${index}`}>Groupe TD</label>
        <select
          id={`groupe-${index}`}
          name={`groupe-${index}`}
          value={membre.groupeTd}
          onChange={(e) => handleChange(e.target.value, index, "groupeTd")}
        >
          {TD.map((td) => (
            <option key={td.id} value={td.grp}>
              {td.grp}
            </option>
          ))}
        </select>
      </div>
      <span
        className="material-symbols-rounded close"
        onClick={() => removeMembre(index)}
      >
        close
      </span>
    </div>
  );
};

export default Membre;
