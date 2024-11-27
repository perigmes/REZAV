export const SelectTicket = (state) => {
    return state.tickets.find((ticket) => ticket.id == state.selectedTicketId)
}