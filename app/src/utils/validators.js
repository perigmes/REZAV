const required = (value) => {
    return value && value.trim() !== '' ? undefined : "La saisie de ce champ est obligatoire";
};

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};

const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const dateMinValue = (minDate) => (value) => {
    if (!isValidDate(value)) {
        return "Vous devez saisir une date valide";
    }
    const inputDate = new Date(value);
    if (inputDate < new Date(minDate)) {
        return `La date doit être postérieure au ${formatDate(new Date(minDate))}`;
    }
    return undefined;
};

const dateMaxValue = (maxDate) => (value) => {
    if (!isValidDate(value)) {
        return "Vous devez saisir une date valide";
    }
    const inputDate = new Date(value);
    if (inputDate > new Date(maxDate)) {
        return `La date doit être antérieure au ${formatDate(new Date(maxDate))}`;
    }
    return undefined;
};



const combineValidators = (...validators) => (value) => {
    for (let validator of validators) {
        const error = validator(value);
        if (error) {
            return error;
        }
    }
    return undefined;
};

export { required, dateMinValue, dateMaxValue, combineValidators };
