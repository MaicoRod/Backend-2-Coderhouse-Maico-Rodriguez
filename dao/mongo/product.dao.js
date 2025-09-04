import ProductModel from '../../models/ProductModel.js';

export default class ProductDao {
  async create(data) {
    return await ProductModel.create(data);
  }

  async find(filter = {}, options = {}) {
    return await ProductModel.paginate(filter, options);
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async updateById(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
