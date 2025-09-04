import UserModel from '../../models/UserModel.js';

export default class UserDao {
  async create(data) { return await UserModel.create(data); }
  async findByEmail(email) { return await UserModel.findOne({ email }); }
  async findById(id) { return await UserModel.findById(id); }
  async updateById(id, data) { return await UserModel.findByIdAndUpdate(id, data, { new: true }); }
}
