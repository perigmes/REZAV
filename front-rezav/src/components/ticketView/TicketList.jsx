import { useDispatch } from 'react-redux'


function TicketList({tickets}){
    const dispatch = useDispatch();

    const handleTicketClick = (ticket) => {
        dispatch(selectTicket(ticket))
    }

    return(
        
    );
}
export default TicketList;