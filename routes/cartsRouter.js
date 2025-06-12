import express from 'express';
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCartProducts,
    updateProductQuantity,
    deleteAllProductsFromCart
} from '../controllers/cartsController.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/products/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', deleteAllProductsFromCart);

export default router;


