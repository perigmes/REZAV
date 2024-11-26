
function Ticket(){

    return(
        <div className="ticket">
            <div className="color-status"></div>
            <h3>{titleName}</h3>
            <span className="datetime">{dateTime}</span>
            <span className="material-icons-round">arrow_forward_ios</span>
        </div>
    );
}
export default Ticket;