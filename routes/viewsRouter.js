import express from 'express';
import ProductService from '../services/ProductService.js';
import CartService from '../services/CartService.js';

const router = express.Router();
const productService = new ProductService();
const cartService = new CartService();

router.get('/', async (req, res) => {
    try {
        const result = await productService.getProducts({ limit: 5, sort: 'desc' });
        res.render('home', { title: "Inicio", featuredProducts: result.docs });
    } catch (error) {
        console.error("Error al obtener productos destacados:", error);
        res.status(500).send("Error interno del servidor.");
    }
});


// Productos con paginación
router.get('/products', async (req, res) => {
    try {
        const result = await productService.getProducts(req.query);
        
        // Buscar o crear un carrito si no existe
        let cart = await cartService.getAnyCart();
        if (!cart) {
            cart = await cartService.createCart();
        }

        res.render('products', {
            title: 'Lista de productos',
            products: result.docs,
            cartId: cart._id,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

// Vista detalle producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: "El producto no existe." });
        }

        // Buscar el primer carrito disponible, o crear uno si no hay ninguno
        let cart = await cartService.getAnyCart();
        if (!cart) {
            cart = await cartService.createCart();
        }

        res.render('productDetail', { 
            title: "Detalle del producto", 
            product, 
            cartId: cart._id // Se pasa un carrito válido a la vista
        });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// Carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado." });
        }

        res.render('cart', { title: "Mi Carrito", cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

router.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartService.addProductToCart(cid, pid);
        res.redirect(`/carts/${cid}`); // Redirige a la vista del carrito
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

// Productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

export default router;
