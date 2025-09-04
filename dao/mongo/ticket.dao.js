import TicketModel from '../../models/TicketModel.js';

class TicketDao {
  async create(data) {
    return await TicketModel.create(data);
  }

  async findById(id) {
    return await TicketModel.findById(id);
  }
};

export default TicketDao;