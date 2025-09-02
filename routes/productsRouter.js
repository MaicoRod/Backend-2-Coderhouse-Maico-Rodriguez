import { Router } from 'express';
import { requireAuth , requireRole } from '../middlewares/auth.js';
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productsController.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);


router.post('/', requireAuth, requireRole('admin'), addProduct);
router.put('/:pid', requireAuth, requireRole('admin'), updateProduct);
router.delete('/:pid', requireAuth, requireRole('admin'), deleteProduct);

export default router;

