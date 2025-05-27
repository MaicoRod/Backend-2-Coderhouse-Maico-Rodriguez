import ProductManager from '../managers/ProductManager.js';

class ProductService {
    constructor() {
        this.productManager = new ProductManager('data/products.json');
    }

    async getProducts() {
        return await this.productManager.getProducts();
    }

    async getProductById(id) {
        return await this.productManager.getProductById(id);
    }

    async addProduct(product) {
        return await this.productManager.addProduct(product);
    }

    async deleteProduct(id) {
        return await this.productManager.deleteProduct(id);
    }
}

export default ProductService;