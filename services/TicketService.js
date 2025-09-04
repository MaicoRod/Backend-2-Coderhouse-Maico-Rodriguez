import TicketModel from '../models/TicketModel.js';
import { v4 as uuidv4 } from 'uuid';

class TicketService {
  async createTicket({ amount, purchaser }) {
    try {
      const ticket = await TicketModel.create({
        code: uuidv4(),             
        purchase_datetime: new Date(), 
        amount,
        purchaser
      });
      return ticket;
    } catch (error) {
      console.error('Error al crear ticket:', error);
      return { error: 'Error al crear el ticket' };
    }
  }
}

export default TicketService;
