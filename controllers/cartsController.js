import CartService from '../services/CartService.js';
const cartService = new CartService();

export const createCart = async (req, res) => {
  const result = await cartService.createCart();
  res.status(201).json(result);
};

export const getCartById = async (req, res) => {
  const result = await cartService.getCartById(req.params.cid);
  result
    ? res.json(result)
    : res.status(404).json({ error: 'Carrito no encontrado' });
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params; // Capturar los parámetros correctamente
        const updatedCart = await cartService.addProductToCart(cid, pid);

        updatedCart.error
            ? res.status(404).json(updatedCart)
            : res.json(updatedCart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

export const deleteProductFromCart = async (req, res) => {
  const result = await cartService.deleteProductFromCart(req.params.cid, req.params.pid);
  res.json(result);
};

export const updateCartProducts = async (req, res) => {
  const result = await cartService.updateCartProducts(req.params.cid, req.body.products);
  res.json(result);
};

export const updateProductQuantity = async (req, res) => {
  const result = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
  res.json(result);
};

export const deleteAllProductsFromCart = async (req, res) => {
  const result = await cartService.deleteAllProductsFromCart(req.params.cid);
  res.json(result);
};

