import fs from 'fs/promises';
import ProductManager from './ProductManager.js';

class CartManager {
    constructor(path) {
        this.path = path;
        this.ProductManager = new ProductManager('./data/products.json');
    }

    //Llamado de todos los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return data.trim() ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al traer el carrito:', error);
            return [];
        }
    }

    //Obetener el carrito por su id
    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id) || null;
    } 

    //Crear un carrito nuevo
    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    //Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            return { error: 'Carrito no encontrado' };
        }

        const product = await this.ProductManager.getProductById(productId);
        if (!product){
            return { error: 'Producto no encontrado' };
        }
        const existingProduct = carts[cartIndex].products.find(p => p.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                carts[cartIndex].products.push({ id: productId, quantity: 1 });
            }
            await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        } 
}

export default CartManager;