import fs from 'fs/promises';
import path from 'path';

class ProductManager {
    constructor() {
        this.path = path.resolve('./data/products.json');
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return data.trim() ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id) || null;
        } catch (error) {
            console.error("Error al obtener producto por ID:", error);
            return null;
        }
    }

    async addProduct(product) {
        try {
            // Validaciones
            if (
                !product.title || typeof product.title !== 'string' ||
                !product.code || typeof product.code !== 'string' ||
                !product.category || typeof product.category !== 'string' ||
                isNaN(product.price) || isNaN(product.stock)
            ) {
                return { error: "Datos inválidos. Verifica title, code, category, price y stock." };
            }

            const products = await this.getProducts();

            // Validar código único
            const exists = products.some(p => p.code === product.code);
            if (exists) return { error: "Ya existe un producto con ese código." };

            product.id = products.length ? products[products.length - 1].id + 1 : 1;
            products.push(product);

            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                return products[index];
            }

            return { error: "Producto no encontrado." };
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            const newProducts = products.filter(product => product.id !== id);

            if (newProducts.length === products.length) {
                return { error: "Producto no encontrado." };
            }

            await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
            return { message: "Producto eliminado." };
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return { error: "Error interno del servidor." };
        }
    }
}

export default ProductManager;
