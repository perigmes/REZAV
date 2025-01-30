import '../assets/styles/pdf.scss';

const OpenPDFButton = ({ pdfUrl, showLink = false }) => {
    const openPDF = () => {
        if (pdfUrl) {
            window.open(pdfUrl, "_blank");
        } else {
            console.error("PDF URL is missing.");
        }
    };

    return (
        <div className='pdf-body'>
            <button
                onClick={openPDF}
                style={{ padding: "10px 20px", cursor: "pointer" }}
                className="material-symbols-rounded pdf-button"
                aria-label="Ouvrir le fichier PDF"
            >
                visibility
            </button>

            {showLink && (
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    Consulter votre plan d'implantation
                </a>
            )}
        </div>
    );
};

export default OpenPDFButton;
