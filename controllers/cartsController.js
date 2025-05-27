import CartService from '../services/CartService.js';

const cartService = new CartService();

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cartId = Number(req.params.cid);
        if (isNaN(cartId)) {
            return res.status(400).json({ error: "ID inválido, debe ser un número." });
        }

        const cart = await cartService.getCartById(cartId);
        cart ? res.json(cart) : res.status(404).json({ error: "El carrito no existe." });
    } catch (error) {
        console.error("Error al obtener carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cartId = Number(req.params.cid);
        const productId = Number(req.params.pid);
        if (isNaN(cartId) || isNaN(productId)) {
            return res.status(400).json({ error: "IDs inválidos, deben ser números." });
        }

        const result = await cartService.addProductToCart(cartId, productId);
        result.error ? res.status(404).json(result) : res.json(result);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};