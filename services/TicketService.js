import TicketModel from '../models/TicketModel.js';
import {v4 as uuidv4} from 'uuid';

class TicketService {
    async createTicket({amount, purchaser}) {
        try {
      const ticket = await TicketModel.create({
        code: uuidv4(), 
        amount,
        purchaser
      });
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      return { error: "No se pudo generar el ticket" };
    }
  }

  async getTicketById(id) {
    return await TicketModel.findById(id);
  }
}

export default TicketService;