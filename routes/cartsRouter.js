// const express = require('express');
// const CartManager = require('../managers/CartManager');
// const router = express.Router();
// const cartManager = new CartManager('data/carts.json');

// //Llamado de todos los carritos
// router.get('/', (req, res) => {
//     res.json(cartManager.getCarts());
// });

// //Generar un carrito nuevo
// router.post('/', (req, res) => res.json(cartManager.createCart()));
    
// //Llamado del carrito por su id
// router.get('/:cid', (req, res) => {
//     const cart = cartManager.getCartById(parseInt(req.params.cid));
//     cart ? res.json(cart) : res.status(404).json({ error: 'El carrito del id requerido no existe' });
// });

// //Agregar un producto al carrito
// router.post('/:cid/products/:pid', (req, res) => {
//     res.json(cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid)));
// });

// module.exports = router;

import express from 'express';
import CartManager from '../managers/CartManager.js';
const router = express.Router();
const cartManager = new CartManager('data/carts.json');

//Crear un carrito nuevo
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

//Llamado de un carrito por su id
router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    cart ? res.json(cart) : res.status(404).json({ error: 'El carrito del id requerido no existe' });
});

//Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const result = await cartManager.addProductToCart(parseInt(req.params.cid), parseInt(req.params.pid));
    result.success ? res.json(result) : res.status(404).json(result);
});

export default router;