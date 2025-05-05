// const express = require('express');
// const ProductManager = require('../managers/ProductManager');
// const router = express.Router();
// const productManager = new ProductManager('data/products.json');

// //Llamado de todos los productos

// router.get('/', (req, res) => res.json(productManager.getProducts()));

// //Llamado de un producto por su id

// router.get('/:pid', (req, res) => {
//     const product = productManager.getProductById(parseInt(req.params.pid));
//     product ? res.json(product) : res.status(404).json({ error: 'El producto del id requerido no existe' });
// });

// //Creación de un producto
// router.post('/', (req, res) => res.json(productManager.addProduct(req.body)));

// //Actualización de datos del producto

// router.put('/:pid', (req, res) => res.json(productManager.updateProduct(parseInt(req.params.pid), req.body)));

// //Eliminar un producto por su id
// router.delete('/:pid', (req, res) => res.json(productManager.deleteProduct(parseInt(req.params.pid))));

// module.exports = router;

import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import e from 'express';
const router = express.Router();
const productManager = new ProductManager('data/products.json');

//Llamado de todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

//Llamado de un producto por su id
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: 'El producto del id requerido no existe' });
});

//Creación de un producto
router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

//Actualización de datos del producto
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    updatedProduct ? res.json(updatedProduct) : res.status(404).json({ error: 'No se modificaron los datos, intenta nuevamente.' });
});

//Eliminar un producto por su id
router.delete('/:pid', async (req, res) => {
    const deletedProduct = await productManager.deleteProduct(parseInt(req.params.pid));
    deletedProduct ? res.json(deletedProduct) : res.status(404).json({ error: 'El producto no pudo ser eliminado, intenta nuevamente.' });
});

export default router;