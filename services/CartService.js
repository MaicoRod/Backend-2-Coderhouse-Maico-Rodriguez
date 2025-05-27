import CartManager from '../managers/CartManager.js';

class CartService {
    constructor() {
        this.cartManager = new CartManager('data/carts.json');
    }

    async getCarts() {
        return await this.cartManager.getCarts();
    }

    async getCartById(id) {
        return await this.cartManager.getCartById(id);
    }

    async createCart() {
        return await this.cartManager.createCart();
    }

    async addProductToCart(cartId, productId) {
        return await this.cartManager.addProductToCart(cartId, productId);
    }
}

export default CartService;