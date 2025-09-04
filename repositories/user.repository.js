import UserDao from '../dao/mongo/user.dao.js';

export default class UserRepository {
  constructor() {
    this.dao = new UserDao();
  }

  create(userData) {
    return this.dao.create(userData);
  }

  findByEmail(email) {
    return this.dao.findByEmail(email);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }
}
