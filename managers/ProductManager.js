// const fs = require('fs');

// class ProductManager {
//     constructor(path) {
//         this.path = path;
//     }

//     //Llamado de todos los productos
//     getProducts() {
//         try {
//             const data = fs.readFileSync(this.path, 'utf-8');
//             return JSON.parse(data);
//         } catch (error) {
//             console.error('Error al leer el archivo:', error);
//             return [];
//         }
//     }

//     //Llamado de un producto por su id
//     getProductById(id) {
//         const products = this.getProducts();
//         return products.find(product => product.id === id) || null;
//     }

//     //Agregar un producto al carrito
//     addProduct(product) {
//         const products = this.getProducts();
//         product.id = products.length ? products[products.length - 1].id + 1 : 1;
//         products.push(product);
//         fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
//         return product;
//     }

//     //Actualizar un producto por su id
//     updateProduct(id, updatedFields) {
//         const products = this.getProducts();
//         const index = products.findIndex(product => product.id === id);

//         if (index !== -1) {
//             products[index] = { ...products[index], ...updatedFields };
//             fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
//             return products[index];
//         }
//         return null;
//     }

//     //Eliminar un producto por su id
//     deleteProduct(id) {
//         let products = this.getProducts();
//         products = products.filter(product => product.id !== id);
//         fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
//         return { message: 'Producto eliminado' };
//     }

// }

// module.exports = ProductManager;

import fs from 'fs/promises';
import path from 'path';
class ProductManager {
    constructor(path){
        this.path = path;
    }

    //Llamado de todos los productos
    async getProducts(){
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return data.trim() ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            await fs.writeFile(this.path, JSON.stringify([]));
            return [];
        }
    }

    //Llamado de un producto por su id
    async getProductById(id){
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;
    }

    //Agregar un producto al carrito
    async addProduct(product){
        const products = await this.getProducts();
        product.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    //Actualizar un producto por su id
    async updateProduct(id, updatedFields){
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);

        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        }
        return null;
    }

    //Eliminar un producto por su id
    async deleteProduct(id){
        let products = await this.getProducts();
        const newProducts = products.filter(product => product.id !== id);
        if (newProducts.length === products.length) {
            return { error: 'Producto no encontrado' };        
    }
    await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return { message: 'Producto eliminado' };
    }
}

export default ProductManager;