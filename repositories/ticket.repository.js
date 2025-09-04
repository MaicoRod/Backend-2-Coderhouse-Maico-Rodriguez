import TicketDao from '../dao/mongo/ticket.dao.js';

export default class TicketRepository {
  constructor() {
    this.dao = new TicketDao();
  }

  create(ticketData) {
    return this.dao.create(ticketData);
  }

  findById(id) {
    return this.dao.findById(id);
  }
};
