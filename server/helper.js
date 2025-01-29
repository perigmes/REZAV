import nodemailer from "nodemailer";
// Fonction pour envoyer un e-mail
export const sendConfirmationEmail = async (reservation) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.univ-lemans.fr", // Ou tout autre service SMTP
        secure:true,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, // Remplacez par votre e-mail
            pass: process.env.EMAIL_PASS, // Remplacez par votre mot de passe (utilisez un mot de passe d'application si nécessaire)
        },
        tls: { rejectUnauthorized: false }
    });

const acceptUrl = `http://localhost:3000/reservation-confirmation/accept/${reservation.idStatus}`;
const rejectUrl = `http://localhost:3000/reservation-confirmation/reject/${reservation.idStatus}`;

const mailOptions = {
    from: "clementine.prouteau.etu@univ-lemans.fr",
    to: "perigmes@gmail.com", // Remplacez par l'e-mail de l'étudiant
    subject: "Confirmation de réservation",
    text: `Une nouvelle réservation a été soumise. Projet: ${reservation.projectName}`,
    html: `
        <h1>Nouvelle réservation</h1>
        <p><strong>Nom de l'étudiant :</strong> clem prouteau</p>
        <p><strong>Nom du projet :</strong> ${reservation.projectName}</p>
        <p><strong>Date de réservation :</strong> ${reservation.reservationDate}</p>
        <p><strong>Date de retour :</strong> ${reservation.returnDate}</p>
        <p><strong>Description du projet :</strong></p>
        <p>${reservation.projectDescription}</p>
        <p><strong>Justification du matériel :</strong></p>
        <p>${reservation.projectJustification}</p>
        
        <p>
            Cliquez sur l'une des options ci-dessous pour répondre à cette demande :
        </p>
        <p>
            <a href="${acceptUrl}" style="color: green; font-weight: bold;">Accepter</a> |
            <a href="${rejectUrl}" style="color: red; font-weight: bold;">Refuser</a>
        </p>
    
        <p>Merci de vérifier la réservation.</p>
        <p>Cordialement,</p>
        <p><em>Votre équipe</em></p>
    `,
    attachments: [
        {
            filename: "plan_implatation.pdf", // Nom du fichier dans l'email
            path: reservation.implementationPlan, // Chemin du fichier stocké
            contentType: "application/pdf",
        },
    ],
};

    // Envoyer l'e-mail
    return transporter.sendMail(mailOptions);
};

export const sendResponseEmail = async (justification) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.univ-lemans.fr", 
        secure:true,
        port: 465,
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });
    const mailOptions = {
        from: "clementine.prouteau.etu@univ-lemans.fr",
        to: "perigmes@gmail.com", //A mettre email de l'étudiant
        subject: "Confirmation de réservation",
        html: `
            <h1>Votre réservation a été ${justification?'refusée': 'acceptée'}</h1>
            <p> ${justification ??''}</p>
        
            <p>Cordialement,</p>
            <p><em>M Houliere</em></p>
        `,
    };

    // Envoyer l'e-mail
    return transporter.sendMail(mailOptions);
};
