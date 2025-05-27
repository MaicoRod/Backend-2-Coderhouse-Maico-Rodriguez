import ProductService from '../services/productService.js';

const productService = new ProductService();

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        if (isNaN(productId)) {
            return res.status(400).json({ error: "ID inválido, debe ser un número." });
        }

        const product = await productService.getProductById(productId);
        product ? res.json(product) : res.status(404).json({ error: "El producto no existe." });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { title, price, code, category, stock } = req.body;
        if (!title || isNaN(price) || !code || !category || isNaN(stock)) {
            return res.status(400).json({ error: "Datos inválidos. Faltan campos requeridos." });
        }

        const newProduct = await productService.addProduct(req.body);

        if (newProduct.error) {
            return res.status(400).json(newProduct);
        }

        // 🔥 Emitir a los sockets conectados
        const updatedProducts = await productService.getProducts();
        req.io.emit('updateProducts', updatedProducts);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = Number(req.params.pid);
        if (isNaN(productId)) {
            return res.status(400).json({ error: "ID inválido, debe ser un número." });
        }

        const deletedProduct = await productService.deleteProduct(productId);

        if (deletedProduct.error) {
            return res.status(404).json(deletedProduct);
        }

        // 🔥 Emitir a los sockets conectados
        const updatedProducts = await productService.getProducts();
        req.io.emit('updateProducts', updatedProducts);

        res.json(deletedProduct);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
