import CartService from '../services/CartService.js';
import TicketService from '../services/TicketService.js';
import UserModel from '../models/UserModel.js';

const cartService = new CartService();
const ticketService = new TicketService();

export const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart();

    if (!req.user.cart) {
      await UserModel.findByIdAndUpdate(req.user._id, { cart: cart._id });
      req.user.cart = cart._id; 
    }

    res.status(201).json(cart);
  } catch (e) {
    console.error('Error al crear carrito:', e);
    res.status(500).json({ error: 'No se pudo crear el carrito' });
  }
};

export const getCartById = async (req, res) => {
  const result = await cartService.getCartById(req.params.cid);
  result
    ? res.json(result)
    : res.status(404).json({ error: 'Carrito no encontrado' });
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params; 
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
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const result = await cartService.updateProductQuantity(cid, pid, Number(quantity));
  return result?.error
    ? res.status(400).json(result)
    : res.json(result);
};

export const deleteAllProductsFromCart = async (req, res) => {
  const result = await cartService.deleteAllProductsFromCart(req.params.cid);
  res.json(result);
};

export const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const userEmail = req.user?.email;

    if (!userEmail) {
      return res.status(401).json({ error: "No autenticado" });
    }

    
    const cart = await cartService.getCartById(cid);
    if (!cart || cart.error) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const purchasedIds = [];     
    const failedIds = [];        
    let totalAmount = 0;

    for (const item of cart.products) {
      const prod = item.product; 
      const qty = item.quantity;

      if (!prod || typeof prod.stock !== 'number') {
        failedIds.push(prod?._id?.toString?.() || null);
        continue;
      }

      if (prod.stock >= qty) {
        prod.stock -= qty;
        await prod.save();
        totalAmount += prod.price * qty;
        purchasedIds.push(prod._id.toString());
      } else {
        failedIds.push(prod._id.toString());
      }
    }

    
    let ticket = null;
    if (purchasedIds.length > 0) {
      ticket = await ticketService.createTicket({
        amount: totalAmount,
        purchaser: userEmail, 
      });
    }

    
    if (failedIds.length > 0) {
      const failedSet = new Set(failedIds);
      cart.products = cart.products.filter(p =>
        failedSet.has(p.product._id.toString())
      );
    } else {
      cart.products = [];
    }

    await cart.save();

    return res.json({
      status: 'success',
      ticket,
      failedProducts: failedIds, 
    });
  } catch (error) {
    console.error("Error en purchase:", error);
    return res.status(500).json({ error: "Error al procesar la compra" });
  }
};
