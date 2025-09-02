import { Router } from 'express';
import { requireAuth, requireRole, cartAccess } from '../middlewares/auth.js';
import {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCartProducts,
    updateProductQuantity,
    deleteAllProductsFromCart, purchase
} from '../controllers/cartsController.js';

const router = Router();

router.post('/', requireAuth, createCart);

router.get('/:cid', requireAuth, cartAccess(), getCartById);

router.post('/:cid/products/:pid', requireAuth, requireRole('user'), cartAccess(), addProductToCart);

router.delete('/:cid/products/:pid', requireAuth, cartAccess(), deleteProductFromCart);

router.put('/:cid', requireAuth, cartAccess(), updateCartProducts);

router.put('/:cid/products/:pid', requireAuth, cartAccess(), updateProductQuantity);

router.delete('/:cid', requireAuth, cartAccess(), deleteAllProductsFromCart);

router.post('/:cid/purchase', requireAuth, requireRole('user'), cartAccess(), purchase);

export default router;


