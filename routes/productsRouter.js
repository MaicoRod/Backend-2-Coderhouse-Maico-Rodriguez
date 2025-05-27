import express from 'express';
import { getProducts, getProductById, addProduct, deleteProduct } from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.delete('/:pid', deleteProduct);

export default router;