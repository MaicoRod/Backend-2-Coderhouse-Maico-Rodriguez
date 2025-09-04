import ProductRepository from '../repositories/product.repository.js';

export default class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getProducts({ limit = 10, page = 1, query, sort }) {
    try {
      const filter = {};
      if (query) {
        if (query === 'available') filter.stock = { $gt: 0 };
        else filter.category = query;
      }

      const sortOption =
        sort === 'asc'
          ? { price: 1 }
          : sort === 'desc'
          ? { price: -1 }
          : {};

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true,
      };

      return await this.repository.findAll(filter, options);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { error: 'Error interno al obtener productos.' };
    }
  }

  async getProductById(id) {
    return await this.repository.findById(id);
  }

  async addProduct(data) {
    if (!data.title || !data.price || !data.stock) {
      return { error: 'Faltan datos obligatorios para crear el producto.' };
    }
    return await this.repository.create(data);
  }

  async updateProduct(id, data) {
    return await this.repository.updateById(id, data);
  }

  async deleteProduct(id) {
    return await this.repository.deleteById(id);
  }
}
