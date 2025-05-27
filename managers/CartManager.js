import fs from 'fs/promises';
import ProductManager from './ProductManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
        this.productManager = new ProductManager('./data/products.json');
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return data.trim() ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al traer el carrito:', error);
            return [];
        }
    }

    async getCartById(id) {
        try {
            if (isNaN(id)) return { error: "ID inválido, debe ser un número." };

            const carts = await this.getCarts();
            return carts.find(cart => cart.id === id) || { error: "Carrito no encontrado." };
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
            return { error: "Error interno del servidor." };
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
            carts.push(newCart);
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            return { error: "Error interno del servidor." };
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            if (isNaN(cartId) || isNaN(productId)) {
                return { error: "IDs inválidos, deben ser números." };
            }

            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) return { error: "Carrito no encontrado." };

            const product = await this.productManager.getProductById(productId);
            if (!product || product.error) return { error: "Producto no encontrado." };

            const existingProduct = carts[cartIndex].products.find(p => p.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                carts[cartIndex].products.push({ id: productId, quantity: 1 });
            }

            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return { error: "Error interno del servidor." };
        }
    }
}

export default CartManager;