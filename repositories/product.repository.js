import ProductDao from '../dao/mongo/product.dao.js';

export default class ProductRepository {
  constructor() {
    this.dao = new ProductDao();
  }

  create(productData) {
    return this.dao.create(productData);
  }

  find(filter, options) {
    return this.dao.find(filter, options);
  }

  findById(id) {
    return this.dao.findById(id);
  }

  updateById(id, data) {
    return this.dao.updateById(id, data);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}
